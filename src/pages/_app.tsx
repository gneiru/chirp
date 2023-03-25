import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: "400",
  subsets: ["latin"],
});

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider {...pageProps}>
      <main className={`${poppins.className}`}>
        <Component {...pageProps} />
      </main>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
