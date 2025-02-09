

import CoverImage from "@/components/CoverImage";
import PriceSelector from "@/components/PriceSelector";
import ProductCard, { DisplayPrice } from "@/components/ProductCard";
import { StripeAppProps, StripePrice, StripeProduct } from "@/types";
import fetchAppServer from "@/utils/fetch";
import { Button, Divider, Typography, useMediaQuery, useTheme } from "@mui/material";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";


export default function Home(props: StripeAppProps) {

    const theme = useTheme();
    const router = useRouter();
    const [product, setProduct] = useState<StripeProduct | null>(null);

    const isSm = useMediaQuery(theme.breakpoints.down('sm'));


    const handleChangePrice = (newPrice: StripePrice) => {

        if (!product) {
            return;
        }
        setProduct(prev => {
            if (!prev) return null;
            return {
                ...prev,
                selectedPrice: newPrice
            }
        })
    }

    const getProduct = async () => {

        const item_id = router.query.product_id;


        const productFetch = await fetch(`/api/products?id=${item_id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!productFetch.ok) {
            return;
        }

        const response = await productFetch.json();


        setProduct({
            ...response.product,
            quantity: 1,
            selectedPrice: response.product.prices[0]
        });
    }

    const handleAddToCart = (e : any) => {
        e.stopPropagation();

        if (!product || !product.prices) {
            alert("Could not get prices for this item.")
            return;
        }
        props.Cart.add(product)
    }

    useEffect(() => {

        if (!router || router.query.item_id === 'item_id') {
            return;
        }

        getProduct();


        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router]);


    if (!product) {
        return <></>
    }

    return (
        <div className="column center"
            style={{
                width: "100%",
                padding: "0.5rem",
                marginTop: isSm ? "0rem" : "5rem"
            }}>

            <div className={isSm ? 'column relaxed' : 'flex between top'} style={{
                position: 'relative',
                flexWrap: 'wrap',
                color: theme.palette.text.primary,
                maxWidth: "70rem"
            }}>
                <div className="column" style={{
                    width: isSm ? "100%" : "45%",
                }}>
                    {product.images && product.images.length > 0 && (
                        <CoverImage
                            url={product.images[0]}
                            width="100%"
                            height="80vh"
                        />
                    )}
                </div>
                <div className="column relaxed" style={{
                    width: isSm ? "100%" : "45%",
                    padding: "3rem",
                    position: "sticky",
                    top: "6rem"
                }}>
                    <Typography variant="h2">{product.name}</Typography>
                    <Divider sx={{ width: "100%" }}></Divider>
                    {product.prices && product.prices.length > 1 && (
                        <>
                            <PriceSelector
                            size="large"
                                product={product}
                                handleChangePrice={handleChangePrice}
                            />
                        </>
                    )}
                    <DisplayPrice
                        style={{
                            fontSize: "2rem",
                        }} product={product}
                    />
                     <Button variant="contained"
                            onClick={handleAddToCart}
                            fullWidth
                            sx={{
                                width: "100%"
                            }}>Add to Cart</Button>
                    <Divider sx={{ width: "100%" }}></Divider>
                    <Typography sx={{fontSize: "1.25rem"}}>{product.description}</Typography>

                </div>
            </div>
        </div>
    );
}
