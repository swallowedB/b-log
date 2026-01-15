import { posts } from "../../../.velite";

export const velitePosts = posts;
export type VelitePost = (typeof velitePosts)[number];