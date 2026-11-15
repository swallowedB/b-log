# Ask Boa 운영

## 기본 상태

Vercel의 Node 22 서버에서 `/api/resume/chat`를 처리합니다. PR 4는 실제 공급자를 연결하지 않아 자유 질문은 항상 안내로 돌아갑니다. 추천 질문과 일치하는 FAQ는 브라우저에서 즉시 답하며 API/AI 비용을 사용하지 않습니다. Preview/CI에 운영 AI 인증을 넣지 않습니다.

## Supabase

기존 프로젝트를 재사용하며 Redis 서버는 필요하지 않습니다. `supabase/migrations/202611110001_resume_chat_store.sql`은 새 Chat 테이블 3개와 예약 RPC만 만듭니다. 기존 좋아요·방명록·권한은 수정하지 않습니다. 운영에 적용하기 전 프로젝트와 기존 마이그레이션 이력을 확인한 뒤 이 SQL만 적용합니다. 전체 schema push/reset은 사용하지 않습니다. 현재 운영 마이그레이션은 아직 적용하지 않았습니다.

서버 전용 `SUPABASE_SECRET_KEY`가 우선이고 기존 `SUPABASE_SERVICE_ROLE_KEY`도 지원합니다. 공개 anon 클라이언트에는 권한을 추가하지 않습니다. 새 테이블은 RLS + anon/authenticated/PUBLIC 접근 회수, 예약 RPC는 security invoker + service_role 실행 권한만 사용합니다. [Supabase 함수 권한](https://supabase.com/docs/guides/database/functions)

예약은 환경별 DB 트랜잭션 잠금 안에서 중복 requestId·입력 해시·모든 한도를 확인한 뒤 한 번에 증가합니다. 외부 AI 호출 전에 잠금을 해제합니다. 방문자 5회/UTC일·3회/분, 전체 30회/UTC일, IP 보조 15회/UTC일입니다. 전체 분당 한도는 `RESUME_CHAT_GLOBAL_RPM`(기본 3, 최대 30)이며 실제 Google 프로젝트 한도보다 낮춰야 합니다. 실패도 예약을 소비하고 자동 재시도/환불하지 않습니다. 요청 ID는 환경 전체에서 고유하며 기존 방문자·입력 해시에 바인딩합니다. 첫 응답이 유실돼 쿠키가 없는 재시도에서도 같은 requestId는 다시 생성하지 않습니다.

운영/개발/Preview 브랜치별 키로 분리합니다. 만료 조건은 모든 조회에 적용하며 예약할 때 각 테이블의 오래된 행을 최대 100개 정리합니다. 요청 기록은 HMAC 방문자·입력 해시·상태만 24시간 보관합니다. 원문 질문·history·IP는 DB/로그/분석에 기록하지 않습니다. 전체·일별 한도 행은 창 종료 시 만료합니다. 사이트 트래픽이 작으므로 별도 정리 스케줄러는 두지 않습니다.

캐시는 `cache.server.ts`의 검수한 고정 질문만, history 없는 요청에 한해 24시간 보관합니다. 임의 질문을 캐시에 넣지 않습니다. 내용 버전·프롬프트 버전·모델이 바뀌면 키가 바뀝니다. 캐시 출처도 이번 검색 문맥의 공개 ID인지 재검사합니다.

## 방문자와 입력

서버에 32자 이상 무작위 `RESUME_CHAT_IDENTITY_SECRET`을 설정합니다. 방문자는 30일 유효한 HttpOnly/SameSite 서명 쿠키로 구분하고 HTTPS에서는 Secure/__Host- 접두사를 사용합니다. 삭제·교체한 쿠키를 완벽하게 동일인으로 식별할 수는 없으며 IP/전체 한도로 보완합니다. IP는 Vercel 배포에서만 `x-vercel-forwarded-for`를 읽어 일별 HMAC으로 변환합니다. 로컬 요청의 해당 헤더는 신뢰하지 않습니다. Production에서 유효한 플랫폼 IP가 없으면 생성하지 않습니다. 다른 프록시/플랫폼으로 옮길 때는 이 신뢰 경계를 다시 구현해야 합니다. [Vercel 요청 헤더](https://vercel.com/docs/headers/request-headers)

본문 16KiB, 질문 1~300 Unicode 문자, history 최대 4개/각 1000자입니다. 클라이언트가 quota/모델/환경을 지정하지 못합니다. 응답은 no-store이며 모델 출력은 일반 텍스트로 렌더링합니다. 네트워크 재확인은 같은 requestId를 사용합니다. 문맥은 공개 자료 최대 3개, 본문 합계 6000자입니다.

## 검증·복구

`pnpm verify`로 콘텐츠·타입·린트·unit·빌드·브라우저를 확인합니다. `pnpm test:store`는 Docker의 일회용 Postgres 17에서 실제 SQL·31개 동시 요청·중복·롤백·UTC·TTL·권한을 검사하고 테스트 DB를 제거합니다. 이미 실행한 전용 로컬 컨테이너는 `TEST_POSTGRES_CONTAINER=이름 pnpm test:store`로 지정할 수 있습니다. 이 명령은 운영 URL에 연결하지 않습니다.

브라우저 pending/quota 화면 검증은 명시적 mock 응답이고 실제 AI 성공 증거가 아닙니다. 운영 확인에는 별도 실제 프로젝트 검증이 필요합니다. 모니터링은 응답 mode/code·한도 거절 수·소요 시간 같은 집계만 사용하고 원문/키/공급자 오류 객체를 출력하지 않습니다. 문제 시 AI flag를 false로 배포해 정적 탐색으로 복구합니다. 코드 롤백 후에도 새 테이블을 즉시 삭제할 필요는 없습니다.
