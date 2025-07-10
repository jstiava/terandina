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
import { Category } from "@/types";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import CoverImage from "@/components/CoverImage";



declare module '@mui/material/Button' {
    interface ButtonPropsVariantOverrides {
        flipped: true;
    }
}

export const headerHeight = "4rem";
const isProduction = true;

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
    const [categories, setCategories] = useState(null);

    const [search, setSearch] = useState<string | null>(null);

    const getCategories = async () => {

        const catFetch = await fetch(`/api/categories`);

        if (!catFetch.ok) {
            return;
        }

        const response = await catFetch.json();

        setCategories(response.categories.map((c: Category) => ({
            ...c,
            products: []
        })));
    }

    const verifySession = async () => {

        const verifyFetch = await fetch(`/api/verify`);

        if (!verifyFetch.ok) {
            return false;
        }

        const response = await verifyFetch.json();
        return true;
    }

    useEffect(() => {
        getCategories();
    }, [])

    useEffect(() => {

        if (protectedRoutes.some(path => router.pathname.startsWith(path))) {

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
        else if (router.pathname === '/login') {
            verifySession()
                .then((res) => {

                    if (!res) {
                        return;
                    }
                    router.push('/admin')
                    return;
                })
        }
        else {
            return;
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.asPath]);

    if (!categories) {
        return (
            <div
                className="flex center middle"
                style={{
                    width: '100vw',
                    height: "100vh",
                    backgroundColor: "#ffffff",
                    backgroundPosition: 'center',
                    opacity: 1,
                    transform: 'scale(1)',
                    // transition: `opacity 0.5s ease-in-out ${3}s`,
                    // ...style,
                }}
            >
                <CoverImage
                    url="/light_bird.png"
                    height={"2.5rem"}
                    width={"5rem"}
                    recursive
                />
            </div>
        )
    }

    return (
        <>
            {isProduction && !protectedRoutes.some(path => router.pathname.startsWith(path)) && (
                <GoogleAnalytics />
            )}
            <ThemeProvider theme={theme}>
                <Head>
                    <meta name="theme-color" content={theme.palette.background.paper} />
                </Head>
                <NextNProgress showOnShallow={false} color={theme.palette.primary.main} />
                <Header Cart={Cart} color={color} setColor={setColor} search={search} setSearch={setSearch} />
                <CartSidebar Cart={Cart} />
                <div id="content" className="column snug" style={{
                    minHeight: "100vh",
                    backgroundColor: theme.palette.background.paper
                }}>
                    <Component {...pageProps} Cart={Cart} categories={categories} search={search} setSearch={setSearch} />
                </div>
                <Footer color={color} />
            </ThemeProvider>
        </>
    )
}