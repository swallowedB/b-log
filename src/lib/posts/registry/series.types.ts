import { FolderTone } from "@/components/common/icons/FolderIcon";
import { CategoryKey } from "@/config/categories";

export type SeriesMeta = {
  id: string;
  name: string;
  description: string;
  category: CategoryKey;
  tone?: FolderTone;
};