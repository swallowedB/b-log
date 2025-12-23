import TagFilterList from "@/components/common/controls/filters/TagFilterList";
import { PostSortValue } from "@/components/common/controls/sort/SortSelect";
import SortSelectClient from "@/components/common/controls/sort/SortSelectClient";

interface PostToolbarProps {
  sort: PostSortValue;
}

export default function PostToolbar({ sort }: PostToolbarProps) {
  return (
    <div className=" lg:mb-10 flex flex-col gap-3 p-5 sm:p-0  lg:flex-row lg:items-center lg:justify-between">
      <TagFilterList />
      <SortSelectClient value={sort} />
    </div>
  );
}
