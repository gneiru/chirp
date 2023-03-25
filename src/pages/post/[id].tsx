import { type NextPage } from "next";
import Head from "next/head";
import { PageLayout } from "~/components/layout";
const SinglePostPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Post</title>
      </Head>
      <PageLayout>
        <div>Post View</div>
      </PageLayout>
    </>
  );
};

export default SinglePostPage;
