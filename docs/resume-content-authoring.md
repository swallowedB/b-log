# 사례·학습 후기 작성

- 사례: `content/_templates/resume-case.mdx`를 `content/resume/cases/새-slug.mdx`로 복사합니다.
- 학습 후기: `content/_templates/learning-entry.mdx`를 `content/learning/새-slug.mdx`로 복사합니다. `type`은 `book`, `conference`, `course` 중 하나입니다.
- `slug`는 고유하게, 날짜는 `YYYY-MM-DD`로 작성합니다. 작성 중에는 `published: false`를 유지합니다.

학습 후기는 Why, Key Takeaways, My Perspective 본문에 한 번만 작성합니다. 적용 상태·설명·연결은 `appliedTo`에 작성하면 상세 화면의 Applied To와 References가 자동 생성됩니다. `planned`는 적용 예정, `not_applied`는 미적용, `applied`는 실제 적용입니다. 실제 적용에는 관련 사례·기술 글·외부 근거 중 하나 이상이 필요합니다. `relatedPostSlugs`에는 기존 기술 글의 slug를 넣어 별도 후기에서 연결합니다.

`appliedTo.relatedCaseIds`에 `case:comma-delta-time`처럼 지정하면 해당 사례에도 후기 링크가 자동 생성됩니다. 프로젝트 ID는 `comma`, `plaist`, `roome`, `mediawave`입니다. 외부 근거와 원본 주소는 HTTPS를 사용합니다. 표지는 생략하면 기본 아이콘으로 표시됩니다. 표지는 `/public` 아래의 `/이미지경로` 또는 기존 Cloudinary 호스트를 사용합니다.

내용과 근거를 검수한 뒤 `published: true`로 바꾸고 `pnpm verify`를 실행합니다. PR 미리보기에서 확인하면 목록·최근 3개 미리보기·상세·검색 자료·사이트맵이 같은 파일로 갱신됩니다. 별도 등록 파일은 없습니다. 비공개 전환 또는 수정 시 답변 캐시의 콘텐츠 버전도 바뀝니다. MDX는 신뢰할 수 있는 작성자만 편집합니다.
