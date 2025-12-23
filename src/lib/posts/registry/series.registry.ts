import { FolderTone } from "@/components/common/icons/FolderIcon";

export type SeriesMeta = {
  id: string;
  name: string;
  description: string;
  category: string;
  tone?: FolderTone; 
};

export const SERIES_META: Record<string, SeriesMeta> = {
  "roome-series": {
    id: "roome-series",
    name: "RoomE",
    description: "3D 룸 투어 서비스 RoomE를 설계부터 배포까지 구현한 과정을 기록한 시리즈입니다.",
    category: "Dev_log",
    tone: "blue",
  },
};
