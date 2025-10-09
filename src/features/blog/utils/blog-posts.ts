import { getBlogPosts } from "@app/providers/NotionProvider";
import type { APIRoute } from "astro";


export const GET: APIRoute = async () => {
  try {
    const posts = await getBlogPosts();
    return new Response(JSON.stringify(posts), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error in blog posts API:", error);
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
