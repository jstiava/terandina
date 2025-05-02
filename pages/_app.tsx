import AuthProvider from "@/layout/AuthProvider";
import "@/styles/globals.scss";
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import type { AppProps } from "next/app";
import Head from "next/head";


export default function App({ Component, pageProps }: AppProps) {

  return (
    <>
      <Head>
        <link rel="icon" type="image/x-icon" href="./favicon.ico" />
      </Head>
      <AuthProvider Component={Component} pageProps={pageProps} />
    </>
  );
}
