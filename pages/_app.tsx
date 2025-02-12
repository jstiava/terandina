import AuthProvider from "@/layout/AuthProvider";
import "@/styles/globals.scss";
import 'swiper/css';
import 'swiper/css/pagination';
import type { AppProps } from "next/app";


export default function App({ Component, pageProps }: AppProps) {

  return (
    <>
      <AuthProvider Component={Component} pageProps={pageProps} />
    </>
  );
}
