<div align="center">
<img width="250" alt="Image" src="https://github.com/user-attachments/assets/4e1d5112-0a54-4bf8-9a05-67ec9aca7093" />
</div>
  


## 1) Intro

>학습한 내용을 글로 정리하고, 프로젝트 경험/회고를 누적해 **검색 가능하고 관리 가능한 지식 베이스**로 운영하는 것을 목표로 합니다.

- B-log는 Next.js 기반으로 제작된 개인 기술 블로그입니다.
- **MDX로 글 작성**: 글을 Markdown + JSX 조합으로 작성해, 코드/컴포넌트/레이아웃을 유연하게 표현합니다.
- **정적 콘텐츠 중심 설계**: 빌드 시점에 콘텐츠를 수집/가공해 페이지 렌더링에 바로 활용합니다.
- **확장 가능한 구조**: 카테고리/태그/요약/썸네일/TOC 등 메타데이터를 기반으로 블로그 기능을 확장할 수 있도록 구성했습니다.

<br/>

## 2) Tech Stack

- **Framework**: Next.js, React
- **Language**: TypeScript
- **Styling**: Tailwind CSS (v4)
- **Content**: MDX + Velite (콘텐츠 수집/가공 파이프라인)
- **MDX Processing**: remark / rehype 기반 플러그인 구성
  - Code Highlight: Shiki + rehype-pretty-code
  - Heading slug/anchor: rehype-slug, rehype-autolink-headings
  - TOC: rehype-toc
  - Links: remark-link-card-plus
- **Tooling**: ESLint, Husky
- **Images**: Cloudinary (Next Image remotePatterns)

<br/>

## 3) Development Environment

- **Node.js**: 22 (`>=22 <23`)
- **Package Manager**: pnpm 10.8.1 (`package.json`의 `packageManager` 기준)
- 이 저장소에는 `.nvmrc`, `.node-version`, `package.json > engines`가 포함되어 있어 Node 버전 불일치를 줄이도록 구성했습니다.
- `nvm` 사용 시 `nvm install` 후 `nvm use`로 `.nvmrc`의 버전을 선택합니다.
- `corepack pnpm install --frozen-lockfile`로 고정된 의존성을 설치합니다.

### 검증과 PR 화면 자료

```bash
corepack pnpm exec playwright install chromium
corepack pnpm verify
```

`verify`는 콘텐츠 생성 → 타입 검사 → 린트 → Jest 테스트 → 프로덕션 빌드 → 브라우저 테스트 순으로 실행합니다. 브라우저 테스트는 빌드된 앱을 `127.0.0.1:3100`에서 잠시 실행하므로 해당 포트를 비워두세요.

- `pnpm test:ci`: 공개 글 조회 등 단위·컴포넌트 동작 검증.
- `pnpm test:e2e`: 빌드된 Resume를 데스크톱·태블릿·모바일과 라이트·다크 테마에서 검사. 320px 폭과 1280×720 화면도 확인합니다.
- `pnpm exec playwright show-report`: 화면 캡처와 실패 trace를 포함한 브라우저 보고서 확인.
- GitHub Actions의 `browser-verification` artifact에도 보고서와 화면 자료를 7일간 보관합니다.

PR에는 Preview URL, 검증한 커밋, 실행 결과와 Before/After 데스크톱·모바일 이미지를 첨부합니다. 이미지는 실제로 열어 잘림·겹침·대비를 확인하고 수정한 뒤 다시 캡처합니다. 정적 화면은 캡처가 검증 근거이며 픽셀 단위 자동 비교를 수행하는 것은 아닙니다. UI가 바뀌지 않은 검증 환경 PR은 동일 화면임을 표시합니다.

<br/>

## 4) 콘텐츠 파이프라인 구성

>이 프로젝트는 **Velite 기반 콘텐츠 파이프라인**으로 MDX 문서를 “읽기 좋은 데이터 구조”로 변환해 사용합니다.

### 🔎 흐름

```txt
1. `content/posts/**/*.mdx`에 글 작성
|
2. 빌드/개발 실행 시 Velite가 MDX 파일을 **수집**
|
3. Frontmatter + 본문을 기준으로 스키마 검증 및 데이터 **정규화**
|
4. remark/rehype 플러그인으로 MDX를 **가공**
   - 코드 블록 하이라이팅(Shiki)
   - 헤딩 slug/anchor 생성
   - TOC 생성
   - 링크 카드 변환 등
|
5. 최종 결과물을 앱에서 import 가능한 형태로 만들어 **페이지 렌더링에 활용**
```

<br/>

### 🤔 왜 이렇게 구성했는가?
- **컨텐츠를 코드처럼 관리**: MDX를 단순 텍스트가 아니라 “검증 가능한 데이터”로 다루기 위해
- **런타임 의존 최소화**: 렌더링 시점이 아니라 빌드 시점에 대부분의 비용을 처리해 성능/안정성을 확보하기 위해
- **확장성**: 카테고리/태그/시리즈/검색/추천글 같은 기능을 메타데이터 기반으로 확장하기 위해
