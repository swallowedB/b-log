import { FolderTone } from "@/components/common/icons/FolderIcon";

export interface SeriesItem {
  id: string;
  name: string;
  postCount: number;
  tone: FolderTone;
}

export const MOCK_SERIES: SeriesItem[] = [
  { id: "room-e", name: "RoomE", postCount: 19, tone: "gray" },
  { id: "slice", name: "Slice", postCount: 12, tone: "pink" },
  { id: "next", name: "Next.js", postCount: 7, tone: "blue" },
  { id: "test", name: "Test", postCount: 5, tone: "gray" },
  { id: "etc", name: "기타", postCount: 3, tone: "blue" },
];

export const VISIBLE_COUNT = 4;
