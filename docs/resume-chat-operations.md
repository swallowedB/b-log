# Ask Boa 운영

## 기본 상태

Vercel의 Node 22 서버에서 `/api/resume/chat`를 처리합니다. PR 5는 Gemini 연결 코드를 포함하지만 실제 계정 설정과 검증이 없어 AI를 기본 off로 유지합니다. 설정이 없으면 자유 질문은 안내로 돌아갑니다. 추천 질문과 일치하는 FAQ는 브라우저에서 즉시 답하며 API/AI 비용을 사용하지 않습니다. Preview/CI에 운영 AI 인증을 넣지 않습니다.

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


## Gemini 무료 프로젝트 설정과 활성화

검증일 2026-11-12. 신규 프로젝트용 모델은 `gemini-3.5-flash-lite` 하나만 허용합니다. 공식 Standard 가격표의 입력·출력 Free Tier 및 구조화 출력 지원을 확인했습니다. 2.5 모델은 기존 이용자 제한이 있어 신규 프로젝트 기본 모델로 선택하지 않았습니다. 모델 변경은 공식 가격/지원 확인 후 allowlist와 PR을 함께 바꿉니다. 런타임 가드는 가격표를 자동 해석하지 않습니다. [가격](https://aistudio.google.com/docs/pricing#gemini-3.5-flash-lite), [모델](https://aistudio.google.com/docs/models/gemini-3.5-flash-lite), [2.5 이용 제한](https://aistudio.google.com/docs/models/gemini-2.5-flash-lite)

1. 결제 계정을 연결하지 않은 전용 Google Cloud 프로젝트에서 Gemini API 키를 준비합니다. 무료 크레딧이 있는 유료 프로젝트는 허용하지 않습니다. 이 프로젝트에 결제를 연결할 권한도 운영상 제한합니다.
2. 별도의 읽기 전용 서비스 계정에는 `apikeys.keys.lookup`와 `resourcemanager.projects.get`만 부여합니다. API Keys API/Cloud Billing API 조회가 가능해야 합니다. 결제 변경 권한은 부여하지 않습니다. Google IAM 설정은 이 PR이 계정에서 실행한 작업이 아닙니다.
3. 서버 환경에 `GEMINI_API_KEY`, `GEMINI_FREE_PROJECT_ID`, `GEMINI_FREE_PROJECT_NUMBER`, `GOOGLE_FREE_TIER_READER_CREDENTIALS`(service_account JSON), `RESUME_CHAT_IDENTITY_SECRET`과 Supabase 서버 키를 등록합니다. 키/JSON을 채팅·Git·공개 환경변수에 넣지 않습니다. JSON의 client_email/private_key만 사용하며 임의 token_uri는 수용하지 않습니다.
4. 기존 Supabase의 프로젝트/마이그레이션 이력을 확인하고 제공한 새 SQL만 적용합니다. 현재 로컬 등록 주소는 DNS 확인 실패 상태이므로 대시보드에서 실제 URL·활성 상태·키·기존 좋아요 기능을 확인해야 합니다.
5. Google AI Studio에서 실제 프로젝트의 RPM/TPM/RPD와 모델 사용 가능 여부를 확인합니다. 전역30회/일보다 낮은 RPD면 배포 전에 SQL의 일 한도를 낮춥니다. `RESUME_CHAT_GLOBAL_RPM`도 프로젝트보다 낮게 맞춥니다. 3개/6000자 문맥, history4개/각1000자, 출력512토큰은 TPM을 자동 보장하지 않습니다.
6. Vercel Production에만 `RESUME_CHAT_AI_ENABLED=true`를 설정합니다. Preview/CI는 설정해도 실제 연결을 차단합니다. 별도 검증용 Vercel/Supabase 환경에서 소수 실제 호출을 먼저 검증하고, 테스트와 운영 저장소를 섞지 않습니다. 현재 실제 호출은 수행하지 않았습니다.
7. 평가 질문은 `tests/fixtures/resume-chat-evaluation.json`으로 검수합니다. 실제 공개 COMMA 근거, 없는 실적/경력, 무관한 질문, 역할 변경/가짜 history, planned 학습 과장을 포함합니다. 자동 HTTP/출처 테스트 통과는 실제 모델의 사실성 평가 통과를 뜻하지 않습니다.

가드는 실제 키의 프로젝트 번호를 조회하고 예상 번호와 일치해야 통과합니다. 조회 결과는 해당 키/프로젝트 조합에만 프로세스 내 재사용합니다. 매 생성 직전에는 **실제 키 프로젝트 번호**로 결제 상태를 조회하고, 반환 projectId도 예상 ID와 같아야 합니다. `billingEnabled === false`와 `billingAccountName === ""`를 모두 요구합니다. 인증·권한·조회 실패, 필드 누락, 다른 프로젝트/결제 연결은 생성 0건입니다. OAuth scope는 cloud-platform.read-only + cloud-billing.readonly이며, 광범위한 쓰기 scope를 쓰지 않습니다. [키 조회](https://docs.cloud.google.com/api-keys/docs/reference/rest/v2/keys/lookupKey), [결제 조회](https://docs.cloud.google.com/billing/docs/reference/rest/v1/projects/getBillingInfo)

SDK는 고정 Developer API 주소·명시적 키·`vertexai:false`·Standard 비스트리밍 generateContent 1회만 사용합니다. 실제 SDK에 HTTP를 가로채는 검사로 429/500에서 요청 1회만 발생하는지 확인합니다. 다른 GOOGLE_API_KEY/Vertex 기본값/다른 주소로 우회하지 않습니다. Search/Maps grounding·업로드·유료 캐시·다른 모델 재시도는 사용하지 않습니다. 메타데이터 요청은 각1.5초, DB 각2.5초, 생성7초 상한이며 클라이언트25초/서버30초입니다. 취소 신호도 생성에 전달합니다. [SDK 재시도 옵션](https://googleapis.github.io/js-genai/release_docs/interfaces/types.HttpRetryOptions.html)

검사와 생성은 Google 프로젝트의 결제 변경과 원자적으로 묶을 수 없습니다. 프로젝트 소유자가 검사 직후 결제를 연결하는 변경까지 코드가 막는다고 보장하지 않습니다. 전용 미결제 프로젝트와 권한 제한을 함께 유지해야 합니다. Vercel/Supabase 사용료도 Gemini 무료 호출과 별개입니다.

프롬프트 규칙은 `prompt.server.ts` 한 곳에 버전 관리하며 자료/질문/history는 별도 JSON 데이터입니다. 모델의 JSON Schema와 서버 검사 양쪽을 통과해야 답합니다. 출처는 이번 검색 문맥의 공개 ID만 인정하고 URL은 서버가 조합합니다. 출처 검증만으로 모든 문장의 사실성이 보장되지는 않으므로 새 공개 콘텐츠와 프롬프트 변경 때 평가를 반복합니다.
