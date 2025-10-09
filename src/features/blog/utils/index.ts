import { getBlogPosts } from "@app/providers/NotionProvider";
import type { APIRoute } from "astro";


export const GET: APIRoute = async ({ url }) => {
  try {
    const category = url.searchParams.get("category");
    const posts = await getBlogPosts();

    const filteredPosts = category
      ? posts.filter((post) => post.tags.includes(category))
      : posts;

    return new Response(JSON.stringify(filteredPosts), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return new Response(
      JSON.stringify({ error: "Error fetching blog posts" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
};
