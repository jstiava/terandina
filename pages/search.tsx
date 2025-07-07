"use client"
import CoverImage from "@/components/CoverImage";
import ProductCard from "@/components/ProductCard";
import { Category, StripeAppProps, StripeProduct } from "@/types";
import fetchAppServer from "@/utils/fetch";
import Mongo from "@/utils/mongo";
import { alpha, Button, Chip, IconButton, TextField, Typography, useMediaQuery, useTheme } from "@mui/material";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getAllProducts } from "./api/products";
import { getAllCategories } from "./api/categories";
import { ObjectId } from "mongodb";
import Fuse from 'fuse.js';
import NativeSearch from "@/icons/NativeSearch";
import { headerHeight } from "@/layout/AuthProvider";


export const getStaticProps = (async (context: any) => {

    let products = null;

    const mongo = await Mongo.getInstance();
    const [category] = await mongo.clientPromise.db('products').collection('categories').find({ type: 'collection' }).toArray();

    if (!category) {
        return {
            notFound: true
        }
    }

    products = await getAllProducts({
        active: true
    })

    if (!products) {
        return {
            notFound: true
        }
    }

    for (const p of products) {
        if (!p.categories) {
            continue;
        }

        const cats = await getAllCategories({
            cat_ids: (p.categories as any).map((c: ObjectId) => c.toString())
        }, {
            getProductsIfVariant: true
        });

        p.quantity = 1;
        p.selectedPrice = p.prices ? p.prices[0] : null;
        p.categories = cats;
    }


    if (category.categories) {
        const cats = await getAllCategories({
            cat_ids: (category.categories as any).map((c: ObjectId) => c.toString())
        }, {
            getProducts: true
        });

        console.log(cats.map(x => x.name))


        for (const cat of cats) {
            for (const p of cat.products) {
                if (!p.categories) {
                    continue;
                }

                const variantCats = await getAllCategories({
                    cat_ids: (p.categories as any).map((c: ObjectId) => c.toString())
                }, {
                    getProductsIfVariant: true
                });

                p.quantity = 1;
                p.selectedPrice = p.prices ? p.prices[0] : null;
                p.categories = variantCats;
            }
        }

        return {
            props: {
                static: {
                    categories: JSON.parse(JSON.stringify(cats)),
                    category: {
                        ...category,
                        _id: category._id.toString(),
                        categories: null
                    },
                }
            }
        }
    }

    try {

        return {
            props: {
                static: {
                    products: JSON.parse(JSON.stringify(products))
                },
            }
        }
    }
    catch (err) {
        console.log(err);
    }
})


export default function SearchAndFilterPage(props: StripeAppProps & {
    static: {
        products: StripeProduct[]
    }
}) {

    const theme = useTheme();
    const router = useRouter();
    const [theFuse, setTheFuse] = useState<Fuse<StripeProduct> | null>(null);

    const [results, setResults] = useState<StripeProduct[] | null>(null);


    const isSm = useMediaQuery(theme.breakpoints.down('sm'));


    useEffect(() => {

        if (!theFuse) {
            const options = {
                includeScore: true,
                threshold: 0.3,
                keys: ["name", "categories.name", "sizes"]
            };
            const fuse = new Fuse(props.static.products, options);
            setTheFuse(fuse);
        }

    }, [props.static]);

    useEffect(() => {

        if (theFuse && props.search) {
            const theResults = theFuse.search(String(props.search));
            setResults(theResults.map(x => x.item) || []);
        }
        else {
            setResults(null);
        }

    }, [props.search, theFuse]);

    useEffect(() => {
        if (router.query.q) {
            props.setSearch(String(router.query.q))
        }
    }, [router])


    if (!props || !props.static) {
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
                    color: '#000000',

                }}>
                <div className="column center snug" style={{
                    maxWidth: "80rem",
                    width: "100%",

                }}>
                    <div className="flex between" style={{
                        width: "100%",
                        position: "sticky",
                        top: headerHeight,
                        backgroundColor: alpha('#f4f4f4', 0.9),
                        padding: isSm ? "0.5rem 0.5rem" : "0.5rem 2rem",
                        zIndex: 1,
                    }}>

                        <TextField
                            autoFocus
                            variant="standard"
                            defaultValue={props.search}
                            placeholder="Search..."
                            onChange={e => {
                                props.setSearch(e.target.value)
                                const params = new URLSearchParams({ q: e.target.value }).toString();
                                router.replace(`/search?${params}`, undefined, { shallow: true })
                            }}
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <div className="flex snug fit">
                                            <IconButton
                                                onClick={e => {
                                                    console.log("Click")
                                                }}
                                            >
                                                <NativeSearch />
                                            </IconButton>
                                        </div>
                                    )
                                }
                            }}
                            sx={{
                                width: results ? "calc(100% - 5rem)" : "100%"
                            }}
                        />

                        {results && (
                            <div className="column compact2 left fit">
                                <Typography variant="caption">{results.length} results</Typography>
                            </div>
                        )}
                    </div>
                    <div className="column left" style={{
                        width: "100%",
                         marginTop: '4rem',
                         
                       
                    }}>
                        {/* <div className="flex compact wrap" style={{
                              flexWrap: "wrap",
                                padding: isSm ? "0rem 0.5rem" : "0rem 2rem",
                        }}>
                            {props.categories?.map(cat => {

                                if (cat.type != 'collection') {
                                    return null;
                                }

                            return (
                                <Chip
                                    key={cat._id}
                                    label={cat.name}
                                    sx={{
                                        marginBottom: "0.5rem"
                                    }}
                                />
                            )
                        })}
                        </div> */}
                    
                    <div className={'flex left top'} style={{
                        flexWrap: 'wrap',
                        color: theme.palette.text.primary,
                        width: "100%",
                       
                    }}>
                        {(results ? results : props.static.products).map((product, index) => {
                            const row = Math.floor(index / 3);
                            const col = index % 3;

                            // Compute animation delay
                            return (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    // addToCart={props.Cart.add}
                                    addToCart={!isSm ? props.Cart.add : undefined}
                                    categories={props.categories?.filter(c => {
                                        return product.categories.some(x => x === c._id)
                                    })}
                                    style={{
                                        // animationDelay: `${delay}ms`,
                                        width: isSm ? "calc(50% - 0.5rem)" : "calc(33% - 0rem)",
                                        marginRight: isSm && index % 2 === 0 ? "0.75rem" : 0,
                                        marginBottom: isSm ? "1rem" : "0rem"
                                    }}
                                />
                            )
                        })}
                    </div>
                    </div>
                    {results && (
                        <div className="column center middle">
                            <Button variant="outlined" onClick={e => {
                                setResults(props.static.products);
                            }}>Show All</Button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
