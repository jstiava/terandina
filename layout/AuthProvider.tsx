import { ThemeProvider } from "@mui/material";
import { NextComponentType, NextPageContext } from "next";
import NextNProgress from 'nextjs-progressbar';
import theme from '@/styles/theme';
import Header from "./Header";
import Footer from "./Footer";
import useCart from "@/checkout/useCart";
import CartSidebar from "./CartSidebar";
import { useState } from "react";



declare module '@mui/material/Button' {
    interface ButtonPropsVariantOverrides {
      flipped: true;
    }
  }

export const headerHeight = "4rem";

export default function AuthProvider({
    Component,
    pageProps,
}: {
    Component: NextComponentType<NextPageContext, any, any>;
    pageProps: any;
}) {

    const Cart = useCart();

    const [color, setColor] = useState("#f4f4f4")

    return (
        <ThemeProvider theme={theme}>
            <NextNProgress color={theme.palette.primary.main} />
            <Header Cart={Cart} color={color} setColor={setColor} />
            <CartSidebar Cart={Cart} />
            <div id="content" className="column snug" style={{
                minHeight: "100vh",
                backgroundColor: color
            }}>
            <Component {...pageProps} Cart={Cart} />
            </div>
            <Footer color={color}/>
        </ThemeProvider>
    )
}