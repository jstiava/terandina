import { ThemeProvider } from "@mui/material";
import { NextComponentType, NextPageContext } from "next";
import NextNProgress from 'nextjs-progressbar';
import theme from '@/styles/theme';
import Header from "./Header";
import Footer from "./Footer";
import useCart from "@/checkout/useCart";
import CartSidebar from "./CartSidebar";

declare module '@mui/material/Button' {
    interface ButtonPropsVariantOverrides {
      flipped: true;
    }
  }

export default function AuthProvider({
    Component,
    pageProps,
}: {
    Component: NextComponentType<NextPageContext, any, any>;
    pageProps: any;
}) {

    const Cart = useCart();


    return (
        <ThemeProvider theme={theme}>
            <NextNProgress color={theme.palette.primary.main} />
            <Header Cart={Cart} />
            <CartSidebar Cart={Cart} />
            <div id="content" className="column snug" style={{
                minHeight: "100vh",
                backgroundColor: '#efe6d6'
            }}>
            <Component {...pageProps} Cart={Cart} />
            </div>
            <Footer />
        </ThemeProvider>
    )
}