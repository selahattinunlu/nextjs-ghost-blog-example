import Head from "next/head";
import { useRouter } from "next/router";
import GhostContentAPI from "@tryghost/content-api";
import Link from "next/link";

const api = new GhostContentAPI({
  url: "https://example-blog.digitalpress.blog",
  key: process.env.GHOST_API_KEY,
  version: "v3",
});

export const getStaticProps = async (context) => {
  const slug = context.params.slug;

  const response = await api.posts.read({ slug });

  return {
    props: {
      post: response,
    },
  };
};

export async function getStaticPaths() {
  const response = await api.posts.browse();

  const paths = response.map((post) => ({
    params: {
      slug: post.slug,
    },
  }));

  return {
    paths,
    fallback: false,
  };
}

const BlogPost = ({ post }) => {
  return (
    <>
      <Head>
        <title>{post.title}</title>
      </Head>

      <main className="container mx-auto lg:max-w-2xl">
        <header className="mt-48">
          <Link href="/">Back</Link>
          <h1 className="text-4xl text-gray-800 font-black">{post.title}</h1>
        </header>

        <div className="blog mt-12 pb-12">
          <div dangerouslySetInnerHTML={{ __html: post.html }}></div>
        </div>
      </main>
    </>
  );
};

export default BlogPost;
