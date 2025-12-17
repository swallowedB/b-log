import TagFilterList from "@/app/(layout)/(shell)/_components/filters/TagFilterList";
import SortSelect from "@/components/common/controls/SortSelect";

export default function PostToolbar() {
  return (
    <div className=" lg:mb-10 flex flex-col gap-3 p-5 sm:p-0  lg:flex-row lg:items-center lg:justify-between">
      <TagFilterList />
      <SortSelect />
    </div>
  );
}
