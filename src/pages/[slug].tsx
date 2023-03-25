import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import { api } from "~/utils/api";
import superjson from "superjson";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { PageLayout } from "~/components/layout";
import Image from "next/image";
import { LoadingPage } from "~/components/loading";
import { PostView } from "~/components/postview";

const ProfileFeed = (props: { userId: string }) => {
  const { data, isLoading } = api.post.getPostsByUserId.useQuery({
    userId: props.userId,
  });

  if (isLoading) return <LoadingPage />;
  if (!data) return <div>Something went wrong!</div>;

  return (
    <div className="flex flex-col">
      {data.map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.id} />
      ))}
    </div>
  );
};

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const { data } = api.profile.getUserByUsername.useQuery({
    username,
  });
  if (!data) return <div>404</div>;
  return (
    <>
      <Head>
        <title>{`${username}'s Profile`}</title>
      </Head>
      <PageLayout>
        <div className="relative h-48 grid-flow-row bg-slate-600 px-4">
          <div className="h-[128px]"></div>

          <Image
            src={data.profilePicture}
            alt={`${data.username ?? ""}'s profile pic`}
            width={128}
            height={128}
            className="rounded-full border-4 border-white dark:border-black"
          />
          <div className="p-4">@{data.username}</div>
          <hr />
          <ProfileFeed userId={data.id} />
        </div>
      </PageLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: { prisma, userId: null },
    transformer: superjson,
  });
  const slug = context.params?.slug;
  if (typeof slug !== "string") throw new Error("No Slug!");

  const username = slug.replace("@", "");

  await ssg.profile.getUserByUsername.prefetch({ username });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      username,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default ProfilePage;
