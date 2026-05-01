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

- **Node.js**: 20 LTS
- **Package Manager**: pnpm
- 이 저장소에는 `.nvmrc`, `.node-version`, `package.json > engines`가 포함되어 있어 Node 버전 불일치를 줄이도록 구성했습니다.
- `nvm`/`fnm` 사용 시: `nvm install 20 && nvm use 20`

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
