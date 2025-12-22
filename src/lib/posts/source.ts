import { posts } from "#site"; 

export const velitePosts = posts;
export type VelitePost = (typeof velitePosts)[number];