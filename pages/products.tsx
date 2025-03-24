import CoverImage from "@/components/CoverImage";
import ProductCard from "@/components/ProductCard";
import { StripeAppProps, StripeProduct } from "@/types";
import fetchAppServer from "@/utils/fetch";
import { Button, Typography, useMediaQuery, useTheme } from "@mui/material";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";


export default function Home(props: StripeAppProps) {

    const theme = useTheme();
    const router = useRouter();
    const [products, setProducts] = useState<StripeProduct[] | null>(null);

    const isSm = useMediaQuery(theme.breakpoints.down('sm'));


    const getProducts = async () => {

        let productList = [];
        let i = 0;

        const productsFetch = await fetch('/api/products');

        if (!productsFetch.ok) {
            return;
        }

        const response = await productsFetch.json();

        for (i; i < response.products.length; i++) {
            const product = response.products[i];
            if (!product.prices || product.prices.length === 0) {
                continue;
            }
            productList.push({
                ...product,
                quantity: 1,
                selectedPrice: product.prices[0]
            })
        }

        setProducts(productList);
    }

    useEffect(() => {
        getProducts();
    }, []);


    if (!products) {
        return <></>
    }


    return (
        <>
            <Head>
                <title>Terandina - Shop All</title>
            </Head>
            <div className="column center"
                style={{
                    width: "100%",
                    padding: isSm ? "0.5rem" : "2rem",
                    marginTop: "6rem",
                    color: '#000000'
                }}>
                <div className={'flex between top'} style={{
                    flexWrap: 'wrap',
                    color: theme.palette.text.primary,
                    maxWidth: "80rem",
                    width: "100%",
                    minHeight: "100vh",
                    padding: "1rem"
                }}>
                    {products.map((product, index) => {
                        const row = Math.floor(index / 3);
                        const col = index % 3;

                        // Compute animation delay
                        const delay = (row + col) * 100;
                        return (
                            <ProductCard
                                key={product.id}
                                product={product}
                                // addToCart={props.Cart.add}
                                addToCart={!isSm ? props.Cart.add : undefined}
                                style={{
                                    animationDelay: `${delay}ms`,
                                    width: isSm ? "calc(50% - 0.5rem)" : "calc(33% - 0rem)",
                                    marginRight: isSm && index % 2 === 0 ? "1rem" : 0
                                }}
                            />
                        )
                    })}
                </div>
            </div>
        </>
    );
}
