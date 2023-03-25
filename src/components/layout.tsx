import type { PropsWithChildren } from "react";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: "400",
  subsets: ["latin"],
});

export const PageLayout = (props: PropsWithChildren) => {
  return (
    <main className={`${poppins.className}`}>
      <div className="flex h-screen justify-center">
        <div className="h-full w-full overflow-y-scroll border-x border-slate-600 md:max-w-2xl">
          {props.children}
        </div>
      </div>
    </main>
  );
};
