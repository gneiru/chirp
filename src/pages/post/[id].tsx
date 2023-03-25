import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import { PageLayout } from "~/components/layout";
import { PostView } from "~/components/postview";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";

const SinglePostPage: NextPage<{ id: string }> = ({ id }) => {
  const { data: d } = api.post.getById.useQuery({
    id,
  });
  if (!d) return <div>404</div>;
  return (
    <>
      <Head>
        <title>{`${d.post.content} - @${d.author.username}`}</title>
      </Head>
      <PageLayout>
        <PostView {...d} />
      </PageLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();
  const id = context.params?.id;
  if (typeof id !== "string") throw new Error("No ID!");

  await ssg.post.getById.prefetch({ id });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default SinglePostPage;
