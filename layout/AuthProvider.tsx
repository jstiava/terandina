"use client"
import { ThemeProvider } from "@mui/material";
import { NextComponentType, NextPageContext } from "next";
import NextNProgress from 'nextjs-progressbar';
import theme from '@/styles/theme';
import Header from "./Header";
import Footer from "./Footer";
import useCart from "@/checkout/useCart";
import CartSidebar from "./CartSidebar";
import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";



declare module '@mui/material/Button' {
    interface ButtonPropsVariantOverrides {
        flipped: true;
    }
}

export const headerHeight = "4rem";

const protectedRoutes = ['/admin'];

export default function AuthProvider({
    Component,
    pageProps,
}: {
    Component: NextComponentType<NextPageContext, any, any>;
    pageProps: any;
}) {

    const Cart = useCart();
    const router = useRouter();

    const [color, setColor] = useState("#f4f4f4");

    const verifySession = async () => {

        const verifyFetch = await fetch(`/api/verify`);

        if (!verifyFetch.ok) {
            return false;
        }

        const response = await verifyFetch.json();
        return true;
    }

    useEffect(() => {

        if (protectedRoutes.some(path => router.pathname.startsWith(path))) {

            console.log("Verifying success")

            verifySession()
                .then((res) => {
                    if (!res) {
                        router.push('/')
                    }
                    console.log("Case 0")
                    return;
                })
            return;
        }
        else {
            return;
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.asPath]);

    return (
        <ThemeProvider theme={theme}>
            <Head>
                <meta name="theme-color" content={color} />
            </Head>
            <NextNProgress color={theme.palette.primary.main} />
            <Header Cart={Cart} color={color} setColor={setColor} />
            <CartSidebar Cart={Cart} />
            <div id="content" className="column snug" style={{
                minHeight: "100vh",
                backgroundColor: theme.palette.background.paper
            }}>
                <Component {...pageProps} Cart={Cart} />
            </div>
            <Footer color={color} />
        </ThemeProvider>
    )
}