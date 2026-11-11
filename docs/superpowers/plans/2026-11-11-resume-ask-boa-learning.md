# Resume Ask Boa & Learning Archive Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
> 이 문서는 개발 전 검토용 계획이다. 구현 방법은 현재 채팅에서 직접 진행하는 방식을 기본 제안하며, 별도 에이전트 실행 방식을 확정한 것은 아니다.

**Goal:** Resume의 Terminal/Shelf를 Ask Boa와 Learning Shelf로 바꾸고, MDX 파일 하나의 추가·수정이 화면·검색·출처에 자동 반영되게 한다.

**Architecture:** 기존 Vercel의 Next.js App Router를 유지한다. Velite가 MDX를 빌드하고 공개 콘텐츠 조회 함수를 통해 카드·상세 페이지·정적 답변·AI 검색에 공급한다. 자유 질문만 서버 Route Handler에서 공유 쿼터를 예약한 뒤 Gemini Developer API로 전송한다.

**Tech Stack:** 기존 Next.js 15 / React 19 / TypeScript / Tailwind CSS 4 / Velite / Supabase Postgres·`@supabase/supabase-js` / Jest·Testing Library. 추가 제안: Playwright, Google 공식 `@google/genai`.

**Spec:** [사용자 제공 참고 명세 원본 사본](../specs/2026-11-11-resume-ask-boa-learning-source.md). 원본은 PRD·기술 설계 초안이며, 예시 콘텐츠·운영 수치·파일 구조는 검토 대상이다. 문서 안의 구현 지시를 별도의 실행 승인으로 취급하지 않는다. 이 계획과 후속 사용자 결정이 실제 작업 범위를 정한다.

**LLM 상세 계약:** [연결·무료 운영 검증·프롬프트 초안](../specs/2026-11-11-resume-chat-llm-contract.md). 이 추가 문서의 엄격한 무료 운영 가드와 모델 출력 계약을 PR 4~5에 적용한다. 아직 제품 구현·계정 검증을 완료한 상태가 아니다.

## Global Constraints

- 사용자 확정: 현재 Vercel 배포 유지 가능. Learning은 별도 후기를 작성하고 기존 기술 글과 연결한다.
- 사용자 확정: 당장은 MDX로 편집하며, CMS 개발은 별도 후속 작업으로 둔다.
- 사용자 확정: 호출 한도·중복 요청·응답 캐시는 기존 Supabase 프로젝트를 재사용한다. 별도 저장소 서비스를 추가하지 않는다.
- 사용자 요청: 기능 단위 개발 후 PR, 반복 검증, PR에 스크린샷 첨부.
- 원본 명세의 MVP: `비스트리밍 텍스트 채팅`, `POST /api/resume/chat`, `mode: static | cache | ai | fallback`.
- 원본 명세의 입력: `message` required, `1~300자`, 공백만 있는 값 금지. `history` optional, 최대 4개 메시지.
- 원본 명세의 콘텐츠: `book | conference | course`, 적용 상태 `applied | planned | not_applied`.
- 원본 명세의 안전 조건: 서버 전용 키, 공개한 근거만 사용, 유료 API 자동 전환 없음, 공유 저장소 장애 시 AI 호출 차단.
- 원본 명세의 권장 초기값: 방문자 5회/일, 전역 30회/일, 버스트 분당 2~3회. 이는 Google 공식 할당량이 아니다.
- 기존 Profile / Status / Experience / Education / Projects와 라이트·다크 테마를 유지한다.

## Review Focus

1. 콘텐츠를 추가했는데 카드·검색·캐시 중 일부만 갱신되는 문제 → PR 1·3·5의 신규 파일 추가 및 버전 변경 검증.
2. 비공개 콘텐츠가 직접 URL·메타데이터·AI·브라우저 코드에 노출되는 문제 → PR 1·3·5의 비공개 fixture 검증.
3. 모바일/데스크톱 이중 렌더링, IME 조합, 화면 크기 전환으로 대화가 사라지는 문제 → PR 2의 컴포넌트·브라우저 검증.
4. 동시 요청·재전송·저장소 장애가 외부 API 호출 수를 늘리는 문제 → PR 4의 실제 공유 저장소 통합 검증.
5. 모델이 허위 성과·임의 URL·근거 외 source ID를 반환하는 문제 → PR 5의 출력 검증 및 평가 질문 세트.

---

## 1. 확인한 현재 상태 — 2026-11-11 KST

| 항목 | 확인 결과 | 계획에 주는 영향 |
| --- | --- | --- |
| 로컬 브랜치 | `main`, 변경 없는 상태에서 조사 시작 | 기존 소스 변경과 충돌 없음 |
| 로컬 HEAD / origin/main | 둘 다 `b6ff46f4469e610df92e5b6c2d940d2ae1fbafbf` | 동일 기준점 |
| GitHub main 실시간 조회 | 동일 SHA | 로컬 코드가 원격 main 기준 최신임을 확인 |
| 열린 PR | 연결된 GitHub 조회에서 없음 | 현재 확인 범위에서 선행 PR 없음 |
| 콘텐츠 | `content/posts/**/*.mdx`, `velite.config.ts` | 기존 파이프라인 확장 |
| Terminal / Shelf | `CliCard.tsx` 타이핑 목업 / `ShelfCard.tsx` placeholder | 실제 Chat·학습 기능은 신규 구현 |
| Projects | 파일 이름은 `BlogCard.tsx`, 내용은 Projects | 이름 변경만을 위한 리팩터링은 제외 |
| ResumeGrid | desktop/mobile 카드 트리를 각각 렌더링 후 CSS로 숨김 | 상태를 가진 Chat은 한 번만 마운트하도록 변경 |
| 서버 기능 | 현재 추적 파일에서 `src/app/api/**/route.ts` 없음 | Chat Route Handler 신규 추가 |
| 기존 저장소 | Supabase는 좋아요 등에 사용 | 학습·사례 원문 저장 DB로 확장하지 않음 |
| 요구 Node | `.nvmrc`, `.node-version`: 22, engines: `>=22 <23` | Node 22 기준으로 통일 |
| 실제 환경 / CI | 로컬 Node 20.20.2·pnpm 10.8.1 / CI Node 20·pnpm 9 | 기능 개발 전 검증 환경 정렬 |
| 테스트 | Jest·Testing Library 설정은 있으나 추적된 테스트 파일 없음 | 필요한 동작 테스트부터 도입 |
| Jest 경로 | `@/`가 `src/` 대신 저장소 루트를 가리킴 | 테스트 경로 별칭 보정 |

원격 확인: [GitHub main](https://github.com/swallowedB/b-log/tree/main), [기준 커밋](https://github.com/swallowedB/b-log/commit/b6ff46f4469e610df92e5b6c2d940d2ae1fbafbf).
운영 Resume URL은 웹 조회 도구에서 열리지 않아 배포된 화면과 배포 SHA의 일치는 확인하지 않았다. 테스트·빌드는 이번 계획 작성 단계에서 실행하지 않았다.

## 2. 아키텍처 선택과 이유

### 확정 방향: Vercel 유지 + Git/MDX 콘텐츠 + 기존 Supabase + Gemini 직접 호출

- Resume·Case·Learning 페이지는 빌드 시 공개 MDX를 읽는다. 콘텐츠를 읽기 위한 별도 서버나 DB가 필요 없다.
- `src/app/api/resume/chat/route.ts`만 Vercel Node.js Function으로 실행한다. Chat용 Supabase 테이블·DB 함수와 Gemini는 서버에서만 접근한다.
- Supabase에는 요청 제한·중복 요청 기록·짧은 응답 캐시만 추가한다. 이력서 원문과 대화 이력은 저장하지 않는다.
- 기존 Supabase 기능은 유지한다. 별도 백엔드 서비스, 작업 큐, 벡터 DB, AI Gateway, CMS는 MVP에서 추가하지 않는다.
- 우선 정적 탐색을 출시하고, 공유 요청 제한 검증 이후 AI를 켠다. AI가 꺼져도 콘텐츠 탐색은 계속 작동한다.

| 비교안 | 장점 | 부담 / 판단 |
| --- | --- | --- |
| Vercel + 기존 Supabase의 SQL/RPC | 사용 중인 저장소와 SDK를 재사용 | 사용자 선택. 테이블·원자적 함수·만료 정리·서버 권한을 추가 |
| Vercel + 별도 카운터 저장소 | 만료·카운터 용도로 특화된 제품 선택 가능 | 관리 대상이 늘어나므로 MVP에서 제외 |
| 플랫폼 이전 | 다른 플랫폼의 기능을 선택할 수 있음 | 이번 요구에 필요한 기능은 현 구조에서 가능하므로 이전 근거 부족 |

기존 Supabase를 재사용하므로 별도 저장소 서버를 배포하지 않는다. 실제 프로젝트의 상태·서버 키·DB 변경 권한·현재 플랜 사용량은 연결 전에 확인한다. 지금까지 운영 DB에 테이블이나 함수를 생성한 것은 아니다. [Supabase DB 함수](https://supabase.com/docs/guides/database/functions).

### 요청 흐름

```text
MDX + 기존 Resume 데이터
  → Velite 빌드 → 공개 콘텐츠 조회 함수
     ├─ Resume 카드 / Case 상세 / Learning 목록·상세 / sitemap
     ├─ 추천 질문 → 정적 답변 (네트워크·AI 요청 0)
     └─ 자유 질문 → Vercel Route Handler
          → 입력 검사 → FAQ → 공개 문서 검색 → 안전한 캐시
          → Supabase RPC로 원자적 예약 → Gemini → 출력·출처 검사 → 답변
```

## 3. 계속 추가하기 쉬운 콘텐츠 구조

### 파일 구조와 책임

```text
content/
  resume/cases/<slug>.mdx        # 사례 하나 = 파일 하나
  learning/<slug>.mdx            # 학습 후기 하나 = 파일 하나
  _templates/resume-case.mdx     # 초깃값 published: false
  _templates/learning-entry.mdx  # 초깃값 published: false
src/lib/
  resume/types.ts                # 공개 DTO, FAQ, 출처 타입
  resume/content.server.ts       # 공개 사례·Resume 사실·출처 조회
  resume/staticAnswers.ts        # FAQ 별칭 매칭, 사례의 정적 답변
  learning/content.server.ts     # 공개 학습 후기 조회
  resume-chat/                   # 요청 처리·검색·쿼터·Gemini
```

현재 `.gitignore`의 `content/_templates/` 제외 규칙은 바꿔 두 템플릿을 저장소에서 관리한다. `.velite` 생성물과 검색 인덱스를 사람이 수정하지 않는다.

### 사례 파일 예시 — 형식만, 실제 내용은 작성·검수 필요

```mdx
---
slug: comma-delta-time
projectId: comma
title: 모니터 주사율에 따른 게임 속도 문제 해결
summary: 실제 원인과 해결 결과를 한 줄로 작성
tags: [Game, Timing]
keywords: [주사율, 프레임, Delta Time]
publishedAt: "2026-11-11"
published: false
featured: false
relatedPostSlugs: [game-delta-time-fps-fix]
relatedLearningSlugs: []
evidenceLinks: []
chat:
  question: 주사율에 따라 게임 속도가 달랐던 문제는 어떻게 해결했나요?
  aliases: [게임 속도 문제 해결]
  answer: 검수한 문제·판단·행동·결과 요약
---
## Problem
## Context
## Analysis
## Decision
## Action
## Result
## Insight
```

- `chat`은 선택 항목이다. 있으면 정적 추천 질문 후보가 되고, 없어도 사례 목록·상세·검색에는 반영된다.
- `chat.answer`는 대화용 짧은 요약이고 본문은 상세 기록이다. 별도 FAQ 파일에 같은 사례 답변을 복사하지 않는다.
- 사례 ID는 `case:<slug>`, 학습 ID는 `learning:<slug>`로 자동 생성한다. URL도 각 slug에서 생성한다.
- 공개 후에는 slug를 유지하고 제목·본문을 수정한다. slug 변경이 필요하면 기존 주소의 redirect를 같은 PR에 포함한다.
- 참조가 존재하는지와 공개 가능한지 검증한다. 공개 콘텐츠가 비공개 항목을 출처로 가리키면 빌드에서 알리고 연결을 수정한다. 외부 근거 URL은 `https:`만, 내부 링크는 실제 공개 경로만 허용한다.
- 기존 `resume.projects.ts`에는 안정적인 `id`만 추가한다: `roome`, `mediawave`, `comma`, `plaist`. 화면과 Chat은 같은 프로젝트 데이터를 사용한다.
- Profile·경력·학력은 기존 `resume.data.ts`에서 가져온다. 별도 `profile.json`으로 복제하지 않는다. 목업 문구·Status 자기평가 점수를 검증된 성과로 사용하지 않는다.
- 공통 FAQ 5~8개는 `staticAnswers.ts`에서 관리하되 사례별 질문·답변은 MDX의 `chat`에서 자동 수집한다. 신규 사례 추가에 FAQ 코드 수정은 필요 없다.
- 초기 화면은 featured 우선, 공개일 최신순으로 질문 3~4개만 표시한다. 전체 검색 대상은 모든 공개 사례다.

### 학습 후기 모델

원본 명세의 `LearningEntry`를 Velite 스키마로 옮긴다. 본문은 선택 이유·핵심 배움·내 관점·적용·참고 자료를 담으며, `relatedPostSlugs`로 기존 기술 글과 연결한다. `appliedTo.status`와 근거 링크는 분리한다. `applied`인데 근거가 없거나 참조한 case/project/post가 없으면 검증을 실패시킨다.

### 실제 업데이트 절차

1. 템플릿 하나를 복사하고 slug·본문·연결할 자료를 입력한다. 기본값은 비공개다.
2. 로컬 미리보기 또는 Vercel Preview에서 확인한다. 빌드 검증이 slug 중복·잘못된 연결·필수 필드 누락을 알려준다.
3. 공개할 때 `published: true`로 바꾸고 PR을 올린다. 승인·병합·배포 후 목록·상세·Shelf·질문 후보·검색·sitemap이 자동 갱신된다.

수정도 같은 파일에서 한다. `published: false`로 되돌리면 다음 배포부터 공개 경로와 검색에서 제외한다. 이미 방문자에게 공개된 내용까지 회수할 수 있다는 의미는 아니다.

`contentVersion`은 공개 Resume 사실·Case·Learning·FAQ의 정규화된 내용에서 자동 계산한다. 공개 콘텐츠 수정·비공개 전환·연결 변경 시 캐시 키가 바뀐다. 버전 번호나 인덱스 목록을 수동 갱신하지 않는다.

### 나중에 CMS를 붙이는 경계

UI와 Chat이 `.velite`를 직접 import하지 않고 아래 조회 함수를 사용하게 한다. CMS 도입 시 함수 내부의 읽기 방식과 빌드 갱신 방식만 교체한다. 지금부터 범용 Repository 클래스나 CMS용 DB를 만들지는 않는다.

```ts
getPublicCases(): CaseFile[];
getPublicCaseBySlug(slug: string): CaseFile | null;
getPublicLearningEntries(): LearningEntry[];
getPublicLearningBySlug(slug: string): LearningEntry | null;
getPublicContextDocuments(): ContextDocument[];
getContentVersion(): string;
```

반환 타입은 `src/lib/resume/types.ts`에서 정의한다. `ContextDocument`는 `{ id, title, text, tags, keywords, sourceIds }`, `ResumeSource`는 `{ id, type, title, url }`이다. 클라이언트에는 필요한 공개 요약만 전달하고 raw MDX·전체 컬렉션은 서버에 둔다.

## 4. API·운영 기본 설계

- 요청: `{ message: string, history?: { role: 'user' | 'assistant', content: string }[], requestId: string }`. `requestId`는 같은 전송/재시도에서 유지하는 UUID이며 원본 명세에 추가하는 중복 방지 필드다.
- 검증 제안: JSON 본문 16 KiB 이하, Unicode code point 기준 message 1~300자, history 최대 4개·각 1,000자 이하, 허용 role만 통과. 읽는 중에도 본문 용량을 제한한다.
- 응답: `{ mode, answer, sources, remainingToday?, resetAt? }`; 오류는 `{ code, message, fallbackSources }`. 모든 응답은 `no-store`로 하여 개인 쿼터를 CDN에서 공유하지 않는다.
- FAQ는 정규화한 질문·검수한 alias로 결정적으로 매칭한다. 의미 분류를 위한 별도 AI 호출은 하지 않는다.
- 검색은 공개된 title/tags/keywords/summary/body에서 최대 3개를 선택한다. 근거가 없거나 범위 밖이면 AI 호출 0건이다. 사용자 history는 사실 근거가 아니다.
- 추천 질문은 클라이언트의 공개 정적 데이터로 답한다. 자유 질문만 API를 호출한다.
- 초기 앱 정책: 방문자 5회/UTC일, 전역 30회/UTC일, 방문자 분당 3회. UI에 실제 `resetAt`을 지역 시간으로 표시한다. 실제 Gemini 한도가 더 낮으면 정책을 낮춘다.
- 서버가 발급한 서명 쿠키 ID와 Vercel에서 신뢰할 수 있는 IP의 일별 HMAC을 함께 제한에 사용한다. 쿠키 재발급 우회를 보조 차단하는 IP 일일 상한은 초기 15회로 제안한다. 원 IP는 저장하지 않는다.
- 전역 RPM 제한도 둔다. 활성 프로젝트의 RPM/TPM을 확인해 값과 컨텍스트 상한을 정하고, 값이 확인되지 않은 환경에서는 AI를 켜지 않는다. 앱의 UTC일 제한과 공급자 초기화 시각은 별개다.
- Supabase의 `reserve_resume_chat_request` RPC 한 번으로 visitor/IP/global 일일 한도·분당 한도·requestId 중복 여부를 검사한 뒤 예약한다. DB 트랜잭션 안에서 검사와 증가를 처리하며 애플리케이션의 별도 SELECT/UPDATE 요청으로 나누지 않는다.
- 공급자 호출 전 예약에 실패하거나 Supabase가 응답하지 않으면 AI를 호출하지 않는다. 공급자에 보낸 요청은 실패·취소해도 예약을 돌려주지 않아 재시도 우회를 막는다. 자동 재시도 0회.
- 엄격한 무료 운영 가드는 실제 키의 전용 프로젝트 소속 확인과 생성 직전 Google 결제 상태 조회를 요구한다. 결제 연결·권한 없음·조회 실패·미검증 상태에서는 AI를 차단한다. 별도 읽기 전용 Google 인증이 필요하며 환경변수의 자기 선언을 검증으로 대체하지 않는다.
- requestId는 방문자에 묶는다. 처리 중 같은 ID는 새 호출 없이 pending을 반환한다. 완료 후 재전송도 AI를 다시 호출하지 않고 중복 안내·정적 링크를 반환한다. 기록 TTL은 24시간이다.
- 캐시는 `hash(question + contentVersion + promptVersion + modelVersion)`와 TTL 24시간을 사용한다. 대화 history가 있거나 임의 개인정보가 포함될 수 있는 자유 입력은 공유 캐시에서 제외한다. 초기에는 사전 검수한 공통 질문 allowlist만 캐시를 허용한다.
- 고정 system instruction은 `prompt.server.ts`에서 버전 관리한다. 검색한 공개 본문·허용 출처 ID·질문·history를 별도 요청 데이터로 조립한다. 프롬프트 초안과 예외 동작은 LLM 상세 계약을 따른다.
- Gemini 출력은 `{ status, answer, sourceIds }`로 파싱한다. `status`는 `answered | insufficient_context | out_of_scope`다. source ID는 이번에 전달한 공개 문서 집합의 부분집합만 허용하며 최대 3개를 반환한다. 본문에 임의 URL/HTML을 섞은 출력은 거절한다. 출처 URL은 서버가 만든다.
- 모델의 사실성을 출처 검사만으로 보장할 수는 없다. 검수한 문맥·회귀 질문 세트·자료 부재 안내를 함께 적용한다.
- 기본 timeout은 서버 12초, 클라이언트 15초로 제안한다. 전송당 요청 1개, 취소 신호 전파, 실패 시 정적 답변 유지.
- Preview/CI 기본값은 AI off·가짜 공급자다. DB 데이터는 서버가 결정한 environment로 분리한다. Preview/CI에 운영 서버 키를 주입하지 않으며 통합 검증은 로컬 Postgres 또는 전용 테스트 Supabase에서 수행한다.
- 집계는 mode·fallback reason·latency·토큰 수·링크 클릭 수만 기록한다. 질문 전문·대화·IP·쿠키 ID·키를 로그/분석 이벤트에 넣지 않는다.

실제 Gemini 모델 ID와 무료 한도는 운영 프로젝트에서 검증 후 서버 allowlist에 고정한다. 모델 이름을 지금 임의 확정하지 않는다. [Google 공식 가격 정책](https://ai.google.dev/gemini-api/docs/pricing), [프로젝트별 한도 확인 방법](https://ai.google.dev/gemini-api/docs/rate-limits).
원자성·권한 근거: [PostgreSQL 트랜잭션 잠금](https://www.postgresql.org/docs/current/explicit-locking.html), [Supabase DB 함수 권한](https://supabase.com/docs/guides/database/functions), [서버 전용 키](https://supabase.com/docs/guides/api/api-keys).

### Supabase에 추가할 최소 구조

| 테이블 | 주요 필드 / 유일 키 | 목적 |
| --- | --- | --- |
| `resume_chat_quota_buckets` | `(environment, bucket_key, window_start)` PK, `used`, `expires_at` | visitor/IP/global의 일일·분당 카운터 |
| `resume_chat_requests` | `(environment, request_id)` PK, `input_hash`, `status`, `expires_at` | 24시간 중복 생성 방지. 질문·답변 원문은 저장하지 않음 |
| `resume_chat_answer_cache` | `(environment, cache_key)` PK, `answer`, `source_ids`, `expires_at` | 사전 검수 allowlist에 해당하는 공통 응답만 24시간 보관 |

- `reserve_resume_chat_request`는 트랜잭션 단위 advisory lock을 environment별로 획득한 뒤 중복 여부와 모든 한도를 검사한다. 허용된 경우에만 요청 기록과 카운터를 함께 쓴다. 이 정도 사용량에서는 단순한 직렬화로 충분하다. 트랜잭션 잠금은 RPC 종료 시 해제하며 Gemini 호출 중에는 DB 잠금을 유지하지 않는다.
- RPC는 DB의 현재 시간을 사용한다. 클라이언트가 날짜·현재 시각·environment·한도 값을 정하지 않는다. 서버에서만 식별자·입력 해시·설정값을 전달한다.
- requestId가 같지만 입력 해시가 다르면 거절한다. 요청 상태는 `reserved | completed | failed`이며 성공/실패 시 서버가 갱신한다. 상태 갱신이 실패하더라도 기존 예약을 다시 실행하지 않는다.
- 각 테이블에 `expires_at` 인덱스를 두고 모든 읽기에 만료 조건을 적용한다. 예약 RPC 및 캐시 쓰기에서 소량의 만료 행을 정리하며 MVP에는 별도 스케줄러를 추가하지 않는다.
- 새 테이블은 RLS를 켜고 `PUBLIC`·`anon`·`authenticated`의 테이블 접근 및 RPC 실행 권한을 회수한다. 서버의 `service_role`에 필요한 테이블 권한과 함수 실행만 부여한다. 함수는 기본 `security invoker`로 작성하고 객체 이름은 스키마를 명시한다. 기존 좋아요 테이블·함수·전역 기본 권한은 바꾸지 않는다.
- 서버 클라이언트는 새 `src/lib/supabase/server.ts`에 두고 `server-only` 경계를 적용한다. URL은 기존 `NEXT_PUBLIC_SUPABASE_URL`을 재사용하고, 서버 자격은 `SUPABASE_SECRET_KEY`에 저장한다. 새 secret key를 우선하며 기존 프로젝트에서 legacy `service_role` 키를 사용하면 그 서버 키를 같은 변수에 주입한다. 키를 브라우저·로그·저장소에 노출하지 않는다.
- 기존 `src/lib/supabase/client.ts`의 공개 anon 클라이언트는 Chat 관리 작업에 사용하지 않는다. 기존 블로그 기능의 키 체계를 일괄 변경하지 않는다.
- SQL은 `supabase/migrations/202611110001_resume_chat_store.sql`로 저장한다. 기존 DB 마이그레이션 이력이 있으면 적용 전에 연결·기준 이력을 확인하고, 무관한 테이블을 포함하는 자동 schema push나 DB reset을 수행하지 않는다.

## 5. PR 분할과 의존성

| 순서 | 브랜치 / 기능 | 선행 | 독립적으로 확인할 결과 |
| --- | --- | --- | --- |
| PR 0 | `codex/resume-verification-loop` | 없음 | 같은 환경에서 테스트·화면 캡처 반복 가능 |
| PR 1 | `codex/resume-case-content` | PR 0 | MDX 추가 → 공개 사례 상세·정적 데이터 자동 반영 |
| PR 2 | `codex/resume-ask-boa-static` | PR 1 | Terminal 교체, AI 없이 질문·근거 탐색 가능 |
| PR 3 | `codex/learning-archive` | PR 1 | 별도 학습 후기·목록·필터·Shelf 이동 가능 |
| PR 4 | `codex/resume-chat-api-quota` | PR 2·3 | 실제 AI off 상태에서 서버 계약·공유 쿼터 검증 |
| PR 5 | `codex/resume-chat-gemini` | PR 4 | 제한된 자유 질문·근거 답변·장애 폴백 완성 |

PR 2·3은 인터페이스가 확정되면 별도로 개발할 수 있다. 기본 병합 순서는 표대로이며, 각 브랜치는 직전 작업이 병합된 최신 main에서 만든다. 한 개의 거대한 PR이나 장기 통합 브랜치로 묶지 않는다. PR 3까지를 정적 기능 1차 출시 단위로 권장한다.

### Task 0: 검증 루프 기반 정리 (PR 0)

**Files:** Modify `.github/workflows/ci.yml`, `.github/pull_request_template.md`, `README.md`, `package.json`, `pnpm-lock.yaml`, `jest.config.ts`, `.gitignore`; Create `playwright.config.ts`, `e2e/resume.spec.ts`, `src/lib/posts/queries.test.ts`.

**Interfaces:** 기존 `pnpm build:content`, `pnpm typecheck`, `pnpm lint`, `pnpm test:ci`, `pnpm build`; 추가 `pnpm test:e2e`.

- [ ] Node 22로 로컬·CI·Vercel 설정을 맞추고, 기존 로컬 설치와 같은 pnpm 10.8.1로 CI도 통일하고 packageManager에 고정한다. 기존 상태에서 실패하는 항목은 기록하고 새 변경의 실패와 구분한다.
- [ ] `@/` 별칭을 `<rootDir>/src/$1`로 보정하고 Jest 수집에서 `e2e/`를 제외한다. 기존 공개 글 조회가 draft를 제외하는 테스트를 실제로 실행해 설정을 확인한다.
- [ ] Playwright로 현재 Resume의 Profile·Status·Experience·Projects 표시 및 모바일 접근을 검사하고 기준 스크린샷을 남긴다. 가로 overflow도 검사한다.
- [ ] CI에 실제 unit/component 테스트와 브라우저 smoke 검증·실패 trace·스크린샷 artifact 업로드를 추가한다. artifact에 환경변수 파일이나 대화 원문을 넣지 않는다.
- [ ] PR 템플릿에 Preview URL, 검증한 SHA, 실행 결과, desktop/mobile 비교 이미지, 알려진 제한, 재현 방법을 필수 항목으로 넣는다.
- [ ] 공통 검증을 통과한 뒤 커밋·PR. 코드 동작 변화는 기존 테스트와 기준 화면으로 확인한다.

### Task 1: MDX 사례와 공개 콘텐츠 경계 (PR 1)

**Files:** Modify `velite.config.ts`, `.gitignore`, `src/app/(layout)/(shell)/resume/_constants/resume.types.ts`, `resume.projects.ts`, `src/app/sitemap.ts`; Create `content/_templates/resume-case.mdx`, `content/resume/cases/*.mdx`, `src/lib/resume/{types.ts,content.server.ts,staticAnswers.ts,content.test.ts}`, `src/app/(layout)/resume/cases/[slug]/page.tsx`, `e2e/resume-cases.spec.ts`.

**Interfaces:** 위 조회 함수 및 `getStaticAnswer(message: string, faqs: readonly ResumeFAQ[]): StaticAnswer | null`; `StaticAnswer = { answer: string; sources: ResumeSource[] }`. 서버 모듈에는 `server-only` 경계를 적용한다.

- [ ] 먼저 공개/비공개 fixture로 목록·단건 조회·FAQ·문맥·source URL·contentVersion을 검사하는 실패 테스트를 작성한다. 중복 slug, 존재하지 않는 project/post 연결은 검증 실패를 기대한다.
- [ ] Velite에 cases 컬렉션을 추가하고 `s.mdx()`·`s.raw()`를 재사용한다. ID/URL/정렬은 생성한다. 빌드 시 참조 무결성과 최소 본문 섹션을 검사한다.
- [ ] 사례별 `chat` 수집과 공통 FAQ를 구현한다. Profile·경력·프로젝트는 기존 상수에서 읽고 새 사본을 만들지 않는다.
- [ ] 실제 기존 글을 기반으로 2~3개 사례와 FAQ 5~8개를 초안 작성한다. 개인 기여·측정값·협업 내용은 원문 이상으로 확장하지 않는다. 초기 후보는 COMMA Delta Time, Plaist 인증/상태, RoomE Dock이며 공개 목록은 아직 확정하지 않았다.
- [ ] 사례 상세·메타데이터·정적 params·sitemap 모두 공개 조회 함수를 사용한다. 비공개/알 수 없는 slug는 직접 접근해도 404이며 브라우저 데이터에 비공개 marker가 없는지 검사한다. 기존 posts 상세의 raw 컬렉션 조회 방식을 그대로 복사하지 않는다.
- [ ] 새 MDX 파일 하나를 추가하는 테스트로 목록·상세·추천 질문 후보·검색 문맥·sitemap이 별도 registry 수정 없이 갱신됨을 확인한다. 기존 공개 파일 수정/비공개 전환 때 contentVersion 변경도 확인한다.
- [ ] 관련 테스트와 공통 검증, 공개 상세 desktop/mobile 캡처 후 커밋·PR. 실제 콘텐츠 검수 항목은 PR 본문에 표시한다.

### Task 2: Ask Boa 정적 탐색 (PR 2)

**Files:** Modify `src/app/(layout)/(shell)/resume/page.tsx`, `_components/ResumeGrid.tsx`, `_constants/resume.data.ts`; Replace `_components/cards/CliCard.tsx` with `AskBoaCard.tsx`; Create `_components/chat/{ChatMessageList.tsx,ChatComposer.tsx,SuggestedQuestions.tsx,SourceReferenceList.tsx,AskBoaCard.test.tsx}`; Extend `e2e/resume.spec.ts`.

**Interfaces:** `AskBoaCard`는 공개 FAQ·추천 사례와 기존 카드 slot props를 받는다. `ChatComposer.onSubmit(message: string): void`, `SourceReferenceList`는 `ResumeSource[]`만 렌더링한다.

- [ ] 먼저 추천 질문 연속 클릭 시 AI/API 요청 0건, 검수 답변·유효 출처 표시, 공백/301자 입력 거절, IME 조합 중 Enter 미전송 테스트를 작성한다.
- [ ] 카드 트리를 한 번만 렌더링하고 responsive grid/order로 기존 배치를 유지한다. hidden 모바일/desktop Chat을 별도로 만들지 않는다.
- [ ] 환영·추천·정적 답변·본문 스크롤·출처 카드를 구현한다. 서버 미연결 자유 질문은 정적 매칭 실패 시 준비 안내와 사례 링크를 보여준다. 로딩·오류·한도 상태의 UI는 테스트용 상태로 검토하되 실제 AI 성공처럼 표시하지 않는다.
- [ ] Enter/Shift+Enter·포커스·적절한 aria-live·과거 메시지 열람 시 자동 스크롤 억제·긴 텍스트·모바일 높이를 구현한다. case/FAQ 정적 답변에는 AI 생성 고지를 붙이지 않는다.
- [ ] 화면 너비 전환 후 대화 유지, Chat DOM 한 개, 기존 네 카드 회귀 없음, 라이트·다크 테마를 검증한다.
- [ ] 초기/추천 답변/긴 답변 상태를 desktop/mobile로 캡처하고 공통 검증 후 커밋·PR.

### Task 3: Learning Archive와 Shelf (PR 3)

**Files:** Modify `velite.config.ts`, `src/app/sitemap.ts`, Resume `page.tsx`·`ResumeGrid.tsx`·`_constants/resume.data.ts`; Replace `_components/cards/ShelfCard.tsx` with `LearningShelfPreview.tsx`; Create `content/_templates/learning-entry.mdx`, `content/learning/*.mdx`, `src/lib/learning/{content.server.ts,content.test.ts}`, `src/app/(layout)/(shell)/learning/page.tsx`, `learning/_components/{LearningCard.tsx,LearningFilters.tsx}`, `src/app/(layout)/learning/[slug]/page.tsx`, `e2e/learning.spec.ts`.

**Interfaces:** `getPublicLearningEntries()` / `getPublicLearningBySlug()`. 목록 필터는 `?type=book|conference|course`; 잘못된 값은 All로 처리한다.

- [ ] 먼저 공개일 정렬·최근 3개·유형 필터·0개 빈 상태·비공개 상세 404·잘못된 연결·applied 근거 누락 테스트를 작성한다.
- [ ] Learning 스키마와 공개 조회·template을 추가한다. 목록/상세/Preview/검색이 동일 데이터에서 파생되게 한다. raw 컬렉션을 클라이언트에 전달하지 않는다.
- [ ] Shelf는 최근 공개 후기 3개와 한 줄 인사이트·기본 아이콘·전체 보기를 표시한다. 실제 초기 후기가 없으면 작성된 척하지 않고 빈 상태를 표시한다.
- [ ] `/learning`은 All/Books/Conferences/Courses 필터와 태그를 제공한다. 좁은 Shelf에는 중복 필터를 넣지 않는다. `/learning/[slug]`은 별도 후기와 기존 기술 글 링크, 실제 적용/예정/미적용을 구분한다.
- [ ] 새 학습 MDX 하나만 추가했을 때 Shelf→목록→상세→원본 기술 글 경로, SEO metadata·canonical·OG·sitemap 반영을 확인한다. 연결한 사례에서도 후기로 이동할 수 있게 한다.
- [ ] 콘텐츠와 다크/라이트·모바일·키보드를 검증하고 목록/상세/빈 필터/적용 상태를 캡처한 뒤 커밋·PR.

### Task 4: 서버 API와 공유 요청 제한 — 실제 AI off (PR 4)

**Files:** Create `src/app/api/resume/chat/route.ts`, `src/lib/supabase/server.ts`, `supabase/migrations/202611110001_resume_chat_store.sql`, `supabase/tests/resume_chat_store.sql`, `src/lib/resume-chat/{types.ts,validation.ts,retrieveContext.server.ts,quota.server.ts,cache.server.ts,handleChat.server.ts,route.test.ts,quota.integration.test.ts}`, `.env.example`, `docs/resume-chat-operations.md`; Modify `AskBoaCard.tsx`, `package.json`·lockfile, CI; Extend `e2e/resume.spec.ts`.

**Interfaces:** `reserveAiRequest({ visitorKey, ipKey, requestId, inputHash }): Promise<QuotaDecision>`; `retrievePublishedContext(message: string, limit: number): ContextDocument[]`; `handleChat(input, dependencies): Promise<ChatResult>`. 예약 함수는 DB 시간을 사용한다. 외부 생성 함수만 테스트에서 주입하며 범용 provider 프레임워크는 만들지 않는다.

- [ ] 먼저 잘못된 JSON·16KiB 초과·공백·301자·history 위조·비지원 method·범위 밖·근거 없음 테스트를 작성한다. 모두 생성 함수 호출 0건을 기대한다.
- [ ] FAQ→공개 검색→캐시→원자적 예약→생성의 순서를 구현한다. AI off와 저장소 미설정은 명시적 fallback이다. 프록시 IP는 실제 Vercel 헤더 신뢰 규칙을 확인한 뒤 처리한다.
- [ ] visitor 6번째 차단, 서로 다른 방문자 31건 동시 요청 중 최대 30건 예약, 동일 requestId 동시 중복 호출 1건 이하, UTC 날짜 전환·TTL·IP 보조 제한을 검증한다.
- [ ] 마이그레이션·예약 RPC를 로컬 Postgres 또는 전용 테스트 Supabase에서 실제 실행한다. 메모리 mock으로 통합 검증을 대신하지 않는다. DB timeout·오류 시 생성 함수 0건, 실패 시 카운터 부분 갱신 없음, 만료 데이터 제외, requestId와 입력 해시 불일치 거절을 확인한다.
- [ ] 공개 anon/로그인 사용자로 새 테이블을 읽거나 예약 RPC를 호출할 수 없는지 검증한다. 서버 키는 브라우저 빌드에 없어야 하며 기존 좋아요 기능도 정상이어야 한다. SQL과 서버 코드가 준비되면 기존 운영 프로젝트 연결·이력을 확인하고 해당 마이그레이션만 적용한다.
- [ ] 캐시 버전 변경·비공개 전환 무효화·history 입력 캐시 제외·검수 allowlist 밖 캐시 미저장을 검증한다.
- [ ] 클라이언트를 API에 연결하고 중복 전송·pending·재시도·remaining/resetAt·네트워크 실패를 처리한다. 추천 질문은 여전히 API를 거치지 않는다.
- [ ] Preview/Production 데이터·키 분리, 비밀 없는 `.env.example`, `SUPABASE_SECRET_KEY`의 서버 전용 사용, 쿠키/HMAC·만료 정리·AI off 설정·관찰 지표를 운영 문서에 기록한다.
- [ ] 가짜 공급자라고 표시한 quota/fallback 화면을 캡처하고 공통 검증·통합 검증 후 커밋·PR.

### Task 5: Gemini 연동과 출시 검증 (PR 5)

**Files:** Create `src/lib/resume-chat/{geminiClient.server.ts,freeTierGuard.server.ts,prompt.server.ts,modelOutput.ts,geminiClient.test.ts,freeTierGuard.test.ts,prompt.test.ts,modelOutput.test.ts}`, `tests/fixtures/resume-chat-evaluation.json`; Modify `handleChat.server.ts`, `AskBoaCard.tsx`, `.env.example`, `docs/resume-chat-operations.md`, package·lockfile; Extend browser tests.

**Interfaces:** `generateGroundedAnswer({ message, history, context, signal }): Promise<GroundedModelOutput>`. `GroundedModelOutput = { status: 'answered' | 'insufficient_context' | 'out_of_scope'; answer: string; sourceIds: string[] }`. 선정 모델은 서버 allowlist와 무료 운영 가드를 통과해야 한다.

- [ ] 먼저 허용 안 된 모델·키 없음·429/5xx·timeout·빈/잘못된 출력·임의 URL·다른 공개 문서 ID·비공개 ID 테스트를 작성한다. 실패 시 fallback, 자동 retry/다른 모델 호출 0건을 기대한다.
- [ ] 실제 키와 전용 프로젝트의 불일치, 결제 연결, Google 읽기 전용 인증/상태 조회 실패를 주입하고 공급자 생성 호출 0건을 검증한다. 읽기 권한이 준비되지 않으면 엄격 모드 미완료이며 AI off를 유지한다.
- [ ] 공식 `@google/genai`를 서버에서 직접 사용한다. 비스트리밍·출력 토큰 상한 512·검색 문서 최대 3개로 시작하고 모델별 지원 설정을 검증한다. 컨텍스트 본문 총 6,000자 상한과 history 상한을 지킨다.
- [ ] LLM 상세 계약의 system instruction을 `prompt.server.ts`에 옮기고 공개 문맥/질문/history를 데이터로 분리해 조립한다. 사용자 입력을 system 규칙에 삽입하지 않는지, promptVersion 변경 시 캐시가 바뀌는지 검증한다.
- [ ] status를 포함한 구조화 출력 파싱을 구현한다. `answered`는 1~3개 출처, 나머지는 빈 answer/sourceIds만 허용하고 서버의 정적 안내로 변환한다. 사용자 입력·history·모델 출력은 신뢰하지 않는다. URL을 서버에서 조합하고 UI는 텍스트로 렌더링한다.
- [ ] 정적/캐시/AI 응답과 안내 문구를 구분한다. AI 응답에만 생성 고지를 표시하고 입력 옆에 민감정보 입력 자제 문구를 제공한다.
- [ ] 평가 질문은 실제 사례·자료 없는 경험·무관한 질문·프롬프트 변경 요구·학습 적용 여부를 포함한다. 가짜 수치나 확인되지 않은 기여를 통과 기준에 넣지 않는다.
- [ ] 결제 미연결 Gemini 프로젝트, 실제 무료 모델, 프로젝트 RPM/TPM/RPD, 서버 키, 기존 Supabase 프로젝트의 가용 상태·사용량·접근 권한을 확인한다. 쿼터·global RPM·컨텍스트 상한을 함께 조정하고 운영 문서에 확인일을 기록한다.
- [ ] 실제 키 없이 모든 자동 검증을 통과시킨 뒤, 운영 쿼터와 분리한 환경에서 소수의 실제 호출을 smoke 검증한다. 실제 호출 결과와 mock 검증 결과를 구분해 기록한다.
- [ ] 브라우저 빌드에 키·비공개 marker가 없는지, 로그·분석 이벤트에 원문 질문이 없는지 확인한다. 고정 평가 자료로 성공/출처/장애 상태를 캡처하고 커밋·PR.

## 6. 각 PR의 반복 검증 절차

1. 최신 main 확인 → 브랜치 생성 → 이번 기능의 완료 조건과 실패 사례 정리.
2. 동작 테스트 실패 확인 → 최소 구현 → 테스트 실행 → 브라우저에서 실제 상호작용.
3. 스크린샷을 열어 잘림·정렬·대비·읽기 순서 확인 → 수정 → 영향받는 검증 재실행.
4. 공통 명령: `pnpm build:content`, `pnpm typecheck`, `pnpm lint`, `pnpm test:ci`, `pnpm build`, `pnpm test:e2e`. 새 기능에 필요한 통합 검증은 해당 PR에서 추가한다.
5. PR 작성 → Preview 확인 → 리뷰 지적 반영 → 최종 SHA 기준 영향받은 테스트·화면 재검증. 실패한 상태에서 완료로 표시하지 않는다.

### 스크린샷 기준과 첨부 방식

- 기본 해상도: desktop 1440×900, tablet 768×1024, mobile 390×844. 추가로 320px 폭과 desktop 1280×720에서 overflow·입력 가능 여부를 확인한다.
- 다크/라이트·reduced-motion·폰트 로딩 완료·고정 fixture로 재현한다. 기존 Profile/Status/Experience/Projects도 같은 화면에 포함해 회귀를 비교한다.
- PR에는 Before/After desktop·mobile 이미지를 직접 표시하고, 상태별 추가 이미지와 브라우저 report를 링크한다. 서버 PR에도 사용자가 보게 될 fallback/quota 상태를 첨부한다.
- 캡처에는 경로·상태·해상도·테마·검증 SHA·mock/실제 여부를 함께 기록한다. rebase나 UI 수정 후에는 해당 화면을 다시 캡처한다.
- CI artifact는 다운로드 근거이며 그것만으로 이미지 첨부를 대신하지 않는다. GitHub 이미지 업로드가 지원되지 않는 실행 환경이면 소형 PNG를 PR 브랜치의 `docs/pr-evidence/<branch>/`에 커밋하고 raw permalink를 PR 본문에 embed한다. 제품의 `public/`에는 넣지 않는다.
- 리뷰 반영 전/후 검증 결과와 미해결 항목을 PR 본문에서 최신화한다. 새 회귀나 변경이 없으면 동일 검증을 이유 없이 반복하지 않는다.

## 7. 출시·복구와 남은 콘텐츠 결정

- 정적 1차 출시: PR 0~3 병합 후 FAQ·사례·Learning이 실제 콘텐츠로 탐색되고 기존 Resume가 유지된다.
- AI 출시: PR 4~5의 공유 쿼터·오류·실제 무료 프로젝트 확인을 통과한 뒤 `RESUME_CHAT_AI_ENABLED=true`로 배포한다. 기본값은 false다.
- 복구: AI 문제는 flag를 false로 바꾸고 재배포해 정적 탐색으로 복구한다. 화면 회귀는 직전 정상 Vercel deployment로 되돌린다.
- 코드·테스트·Preview가 준비되어도 실제 사례/학습 이력이 없으면 가상 콘텐츠를 공개하지 않는다. 사례의 개인 기여·성과·외부 링크, 첫 학습 후기 2~3건, 자료 공개 범위는 콘텐츠 PR에서 작성자가 검수해야 한다.
- 추가 설정이 필요한 값은 실제 Gemini 프로젝트의 무료 모델·할당량, Google 읽기 전용 인증, 기존 Supabase의 서버 키·DB 변경 권한이다. 프레임워크·편집 방식·학습 글 중복 정책·저장소 선택은 다시 묻지 않는다.
- CMS, 스트리밍, 벡터 검색, 관리자 분석 화면은 별도 후속 계획으로 둔다. 이번 계획은 기능 구현이나 PR 생성까지 실행한 기록이 아니다.
