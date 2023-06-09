import { SignInButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Image from "next/image";
// import Link from "next/link";

import { api } from "~/utils/api";
import { LoadingPage, LoadingSpinner } from "~/components/loading";
import { useState } from "react";
import toast from "react-hot-toast";
import { PageLayout } from "~/components/layout";
import { PostView } from "~/components/postview";

const CreatePostWizard = () => {
  const { user } = useUser();
  // console.log(user)
  const [input, setInput] = useState<string>("");
  const ctx = api.useContext();

  const { mutate, isLoading: isPosting } = api.post.create.useMutation({
    onSuccess: (e) => {
      setInput("");
      void ctx.post.getAll.invalidate();
      const successMessage = `Successfully posted ${e.content}`;
      toast.success(successMessage);
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if (errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0]);
      } else {
        toast.error("Please try again later.");
      }
    },
  });

  if (!user) return null;

  return (
    <div className="flex border-b p-4">
      <Image
        alt={`Profile Image`}
        src={user.profileImageUrl}
        className="rounded-full"
        width={56}
        height={56}
      />
      <input
        type="text"
        placeholder="Post emoji(s)"
        className="grow bg-transparent outline-none"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={isPosting}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            if (input !== "") {
              mutate({ content: input });
            }
          }
        }}
      />
      {input !== "" && !isPosting && (
        <button onClick={() => mutate({ content: input })}>Post</button>
      )}
      {isPosting && (
        <div className="flex items-center justify-center">
          <LoadingSpinner size={20} />
        </div>
      )}
    </div>
  );
};


const Feed = () => {
  const { data, isLoading: postsLoading } = api.post.getAll.useQuery();

  if (postsLoading) return <LoadingPage />;
  if (!data) return <div className="">Something Went Wrong</div>;
  return (
    <div className="flex flex-col">
      {data.map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.id} />
      ))}
    </div>
  );
};

const Home: NextPage = () => {
  const { isLoaded: userLoaded, isSignedIn } = useUser();
  api.post.getAll.useQuery();

  if (!userLoaded) return <div />;

  return (
    <PageLayout>
      <div>
        {!isSignedIn && (
          <div className="flex border-b border-slate-200">
            <SignInButton />
          </div>
        )}
        {!!isSignedIn && <CreatePostWizard />}
        {/* {!!user.isSignedIn && <SignOutButton />} */}
      </div>
      <Feed />
    </PageLayout>
  );
};

export default Home;
