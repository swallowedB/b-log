
import PostSection from "@/app/(layout)/(shell)/_components/posts/PostSection";
import { MOCK_POSTS } from "@/app/(layout)/(shell)/_constants/mockPosts";
import SortSelect from "@/components/common/controls/SortSelect";

const MOCK_SERIES_META = {
  id: "roome-series",
  name: "RoomE",
  description:
    "3D 룸 투어 서비스 RoomE를 설계부터 배포까지 구현한 과정을 기록한 시리즈입니다.",
};

export default function SeriesPostList() {
  return (
    <section className="mt-10">
      <div>
        <h2 className="text-3xl font-bold">{MOCK_SERIES_META.name}</h2>

        <div className="flex items-center justify-between">
          <span className="text-foreground/70 text-sm ">: {MOCK_SERIES_META.description}</span>
          <SortSelect />
        </div>
        <PostSection
          posts={MOCK_POSTS}
          totalCount={MOCK_POSTS.length}
          page={1}
          pageSize={16}
          cardSize="sm"
        />
      </div>
    </section>
  );
}
