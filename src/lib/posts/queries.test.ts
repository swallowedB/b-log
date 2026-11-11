import {
  getAllPosts,
  getPostBySlug,
  getPostsByCategory,
  getPostsByTag,
} from "@/lib/posts/queries";

jest.mock("./source", () => ({
  velitePosts: [
    {
      title: "Public dev log", slug: "public-dev", date: "2026-01-01",
      category: "Dev_log", tags: ["React"], draft: false, code: "", toc: [],
    },
    {
      title: "Private draft", slug: "private-draft", date: "2026-01-02",
      category: "Dev_log", tags: ["React"], draft: true, code: "", toc: [],
    },
    {
      title: "Public insight", slug: "public-insight", date: "2026-01-03",
      category: "Insight", tags: ["Docker"], draft: false, code: "", toc: [],
    },
  ],
}));

describe("public post queries", () => {
  it("excludes drafts from the list and direct slug lookup", () => {
    expect(getAllPosts().map((post) => post.slug)).toEqual(["public-dev", "public-insight"]);
    expect(getPostBySlug("private-draft")).toBeNull();
    expect(getPostBySlug("missing")).toBeNull();
    expect(getPostBySlug("public-dev")?.title).toBe("Public dev log");
  });

  it("excludes drafts when filtering by category or tag", () => {
    expect(getPostsByCategory("Dev_log").map((post) => post.slug)).toEqual(["public-dev"]);
    expect(getPostsByTag("React").map((post) => post.slug)).toEqual(["public-dev"]);
    expect(getPostsByTag("Unknown")).toEqual([]);
  });

  it("includes drafts only when explicitly requested and returns a separate list", () => {
    const posts = getAllPosts({ includeDrafts: true });
    expect(posts.map((post) => post.slug)).toEqual(["public-dev", "private-draft", "public-insight"]);
    expect(getPostBySlug("private-draft", { includeDrafts: true })?.draft).toBe(true);
    posts.pop();
    expect(getAllPosts({ includeDrafts: true })).toHaveLength(3);
  });
});
