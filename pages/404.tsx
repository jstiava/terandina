import ProductCard from "@/components/ProductCard";
import { StripeAppProps, StripeProduct } from "@/types";
import fetchAppServer from "@/utils/fetch";
import { Button, Typography, useMediaQuery, useTheme } from "@mui/material";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";


export default function ErrorPage(props: StripeAppProps) {

    const theme = useTheme();
    const router = useRouter();

    return (
        <div className="column relaxed center top"
            style={{
                width: "100%",
                padding: "15vh 0.5rem 0 0.5rem",
                height: "calc(100vh - 5rem)",
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText
            }}>

            <Typography variant="h1" sx={{
                fontSize: "8rem"
            }}>404</Typography>
            <Typography variant="h2">Errors don&apos;t make us cozy either.</Typography>
            <Button variant="flipped" onClick={() => router.push('/')}>
                Go to Homepage
            </Button>
        </div>
    );
}
