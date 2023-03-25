import Image from "next/image";
// import Link from "next/link";

import { type RouterOutputs } from "~/utils/api";

import Link from "next/link";
import dayjs from "dayjs";
import relativetime from "dayjs/plugin/relativeTime";


dayjs.extend(relativetime);

type PostWithUser = RouterOutputs["post"]["getAll"][number];
export const PostView = (props: PostWithUser) => {
  const { post, author } = props;
  return (
    <div className="flex border-b p-4" key={post.id}>
      <Link href={`/@${author.username}`}>
        <Image
          src={author.profilePicture}
          className="gap-4 rounded-full"
          alt={author.username}
          width={56}
          height={56}
        />
      </Link>
      <div className="flex-col">
        <div className="flex gap-1 font-bold">
          <Link href={`/@${author.username}`}>
            <span>{`@${author.username}`}</span>
          </Link>{" "}
          <span className="font-thin ">
            <Link href={`/post/${post.id}`}>
              • {`${dayjs(post.createdAt).fromNow()}`}
            </Link>
          </span>
        </div>
        <div className="text-xl">{post.content}</div>
      </div>
    </div>
  );
};
