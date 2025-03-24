

import CoverImage from "@/components/CoverImage";
import PriceSelector from "@/components/PriceSelector";
import ProductCard, { DisplayPrice } from "@/components/ProductCard";
import { Category, SIZING_OPTIONS, StripeAppProps, StripePrice, StripeProduct } from "@/types";
import fetchAppServer from "@/utils/fetch";
import { Button, Chip, Divider, Typography, useMediaQuery, useTheme } from "@mui/material";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import CategoryVariantSelector from "@/components/CategoryVariantSelector";
import ScrollButton from "@/components/ScrollButton";


export default function Home(props: StripeAppProps) {

    const theme = useTheme();
    const router = useRouter();
    const [product, setProduct] = useState<StripeProduct | null>(null);
    const [categories, setCategories] = useState<Category[] | null>(null);
    const swiperRef = useRef<any>(null);
    const isSm = useMediaQuery(theme.breakpoints.down('sm'));
    const isMd = useMediaQuery(theme.breakpoints.down('md'));

    const [products, setProducts] = useState<StripeProduct[] | null>(null);

    const [clientHeight, setClientHeight] = useState(0);
    const [scrollHeight, setScrollHeight] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY || document.documentElement.scrollTop;
            setScrollHeight(scrollY)
        };
        setClientHeight(document.documentElement.clientHeight);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


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

        if (!item_id) {
            console.log("There was no product_id provided.")
        }

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


        if (response.product.categories) {

            let theCats: Category[] = [];

            for (const cat_id of response.product.categories) {
                const category = props.categories?.find(c => c._id === cat_id);

                if (!category) {
                    continue;
                }

                await fetch(`/api/products?category=${cat_id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
                    .then(res => res.json())
                    .then(res => {

                        if (res.products) {
                            category.products = res.products;
                        }
                        theCats.push(category);
                    })

            }

            setCategories(theCats)
        }


        setProduct({
            ...response.product,
            quantity: 1,
            media: response.product.media,
            selectedPrice: response.product.prices[0]
        });
    }

    const handleAddToCart = (e: any) => {
        e.stopPropagation();

        if (!product || !product.prices) {
            alert("Could not get prices for this item.")
            return;
        }
        props.Cart.add(product)
    }

    useEffect(() => {

        if (!router || router.query.product_id === 'product_id') {
            return;
        }

        // Get related items
        fetch(`/api/products?related_to=${router.query.product_id}`)
            .then(res => res.json())
            .then(response => {

                let productList = [];
                let i = 0;

                for (i; i < response.products.length; i++) {
                    const product = response.products[i];
                    if (!product.prices || product.prices.length === 0) {
                        continue;
                    }
                    productList.push({
                        ...product,
                        quantity: 1,
                        media: product.media,
                        selectedPrice: product.prices[0]
                    })
                }

                setProducts(productList);
            })
            .catch(err => {
                return;
            })

        getProduct();


        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router]);


    if (!product) {
        return <></>
    }

    return (
        <>
            <Head>
                <title>{product.name} - Terandina - Handcrafted Native Outerwear and Accessories</title>
            </Head>
            {isSm && (
                <ScrollButton
                    scrollPercentage={0.5}
                >
                    <div className="flex between center"
                        onClick={() => {
                            window.scrollTo({ top: 0, behavior: 'smooth' })
                        }}
                        style={{
                            position: 'fixed',
                            zIndex: 5,
                            top: '4rem',
                            padding: `0 2rem`,
                            height: "3.5rem",
                            borderBottom: `1px solid ${theme.palette.divider}`,
                            backgroundColor: theme.palette.background.paper,
                            animation: 'fade 0.2s ease-in-out forwards'
                        }}>
                        <Typography variant="h5" sx={{
                            fontSize: "1rem"
                        }}>{product.name}</Typography>
                        <DisplayPrice
                            style={{
                                fontSize: "1rem",
                                marginLeft: "1rem"
                            }} product={product}
                        />
                    </div>
                </ScrollButton>
            )}
            <div className="column center"
                style={{
                    width: "100%",
                    padding: isSm ? "0" : "0 2rem",
                    marginTop: "5rem"
                }}>

                <div className={isSm ? 'column relaxed' : 'flex top'} style={{
                    position: 'relative',
                    width: "100%",
                    color: theme.palette.text.primary,
                    // maxWidth: "70rem"
                }}>
                    {isSm ? (
                        <div className="flex" style={{
                            padding: 0,
                            width: "100%",
                            overflow: 'hidden'
                        }}>
                            <Swiper
                                ref={swiperRef}
                                direction="horizontal"
                                slidesPerView={1}
                                spaceBetween={10}
                                // slidesOffsetBefore={-30}
                                style={{
                                    display: 'flex',
                                    width: "100%",
                                    height: "fit-content",
                                    padding: 0,
                                    "--swiper-theme-color": theme.palette.primary.main,
                                    "--swiper-pagination-color": theme.palette.primary.main,  // Active bullet color
                                    "--swiper-pagination-bullet-inactive-color": "gray", // Inactive bullet color
                                    "--swiper-pagination-bullet-inactive-opacity": "0.5",
                                    "--swiper-navigation-size": 64,
                                    "--swiper-navigation-top-offset": "calc(50% - 1rem)",
                                } as CSSProperties}
                                pagination={{
                                    clickable: true,
                                }}
                                modules={[Pagination]}
                                breakpoints={{
                                    300: {
                                        slidesPerView: 1,
                                        spaceBetween: 10,
                                    },
                                }}
                                className="mySwiper"
                            >
                                {product.media.map((image, index) => (
                                    <SwiperSlide className="slide" key={`${image.small || ''}_${index}`}>
                                        <CoverImage
                                            url={image.large || ''}
                                            width="100vw"
                                            height="auto"
                                            style={{
                                                aspectRatio: "1/1"
                                            }}
                                        />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    ) : (
                        <>
                            <div className="column" style={{
                                position: 'relative',
                                width: isSm ? "100%" : isMd ? '25rem' : '45%',
                                height: "fit-content"
                            }}>
                                {product.media && product.media.length > 0 && (
                                    <>
                                        <div className="column compact" style={{
                                            position: "sticky",
                                            top: `calc(100vh - ${product.media.length * 42}px)`,
                                            left: "3.5rem",
                                            zIndex: 1,
                                            width: "fit-content",
                                            padding: "1rem 0"
                                        }}>
                                            {product.media && product.media.map((image, index) => {

                                                const top = (index * (clientHeight - 90 + 8));
                                                return (
                                                    <div
                                                        onClick={() => window.scrollTo({ top, behavior: 'smooth' })}
                                                        key={`${image.small || 'small'}_${index}`}
                                                        style={{
                                                            width: "0.7rem",
                                                            height: "0.7rem",
                                                            borderRadius: "100%",
                                                            // border: `0.1rem solid ${theme.palette.primary.main}`,
                                                            backgroundColor: scrollHeight >= (top - ((clientHeight - 90) / 2)) && scrollHeight <= (top + ((clientHeight - 90) / 2)) ? theme.palette.primary.main : 'white',

                                                        }}></div>
                                                )
                                            })}
                                            {/* <>
                             <Typography>{scrollHeight / clientHeight}</Typography>
                             </> */}
                                        </div>
                                    </>
                                )}
                                <div className="column" style={{
                                    width: "100%",
                                    marginTop: `calc(-1 * ${(product.media.length * 32) + 16}px)`,
                                }}>
                                    {product.media && product.media.map(image => (
                                        <CoverImage
                                            key={image.large || ''}
                                            url={image.large || ''}
                                            width="100%"
                                            height="calc(100vh - 90px)"
                                        />
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                    <div className="column relaxed" style={{
                        width: isSm ? "100%" : `calc(100% - ${isMd ? '25rem' : '45%'})`,
                        maxWidth: "40rem",
                        padding: isSm ? "0 2rem" : "3rem",
                        position: "sticky",
                        top: "6rem"
                    }}>
                        <div className="flex between top">
                            <Typography variant="h1" sx={{
                                fontSize: "1rem"
                            }}>{product.name}</Typography>
                            <DisplayPrice
                                style={{
                                    fontSize: "1rem",
                                    marginLeft: "1rem"
                                }} product={product}
                            />
                        </div>

                        {product && categories && categories.some(c => c.type === 'variant') && categories.map(c => {

                            if (c.type != 'variant') {
                                return null;
                            }

                            return (
                                <div className="flex compact" key={c._id.toString()}>
                                    <CategoryVariantSelector
                                        key={c._id}
                                        category={c}
                                        product={product}
                                        onClose={() => {
                                            return;
                                        }}
                                    />
                                </div>
                            )
                        })}
                        {product.prices && product.prices.length > 1 && (
                            <>
                                <PriceSelector
                                    size="small"
                                    product={product}
                                    handleChangePrice={handleChangePrice}
                                />
                            </>
                        )}
                        {product.sizes && (
                            <div className="flex compact2">
                                {SIZING_OPTIONS.map(size => {
                                    const marking = product.sizes && typeof product.sizes === 'object' ? product.sizes[size] : null;

                                    const doesNotExist = marking === undefined || marking === null;

                                    if (doesNotExist) {
                                        return;
                                    }

                                    return (
                                        <Chip
                                            className={!marking ? 'crossed-out' : ''}
                                            size="medium"
                                            key={size}
                                            label={size}
                                            onDelete={undefined}
                                            disabled={!marking}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setProduct(prev => {
                                                    if (!prev) return null;
                                                    return {
                                                        ...prev,
                                                        size
                                                    }
                                                })
                                            }}
                                            sx={{
                                                marginBottom: "0.25rem",
                                                overflow: 'hidden',
                                                backgroundColor: size === product.size ? theme.palette.divider : 'transparent'
                                            }}
                                        />
                                    )
                                })}
                            </div>
                        )}

                        <Button variant="outlined"
                            onClick={handleAddToCart}
                            fullWidth
                            sx={{
                                width: "100%"
                            }}>Add to Cart</Button>


                        {product.description && (
                            <div className="column compact">
                                <Typography variant="h6" sx={{ fontSize: "0.85rem", whiteSpace: 'pre-wrap' }}>DESCRIPTION</Typography>
                                <Typography sx={{ fontSize: "0.85rem", whiteSpace: 'pre-wrap' }}>{product.description}</Typography>
                            </div>
                        )}

                        {product.details && (
                            <div className="column compact">
                                <Typography variant="h6" sx={{ fontSize: "0.85rem", whiteSpace: 'pre-wrap' }}>DETAILS</Typography>
                                <Typography sx={{ fontSize: "0.85rem", whiteSpace: 'pre-wrap' }}>{product.details}</Typography>
                            </div>
                        )}

                    </div>


                </div>

                <div className="column compact left" style={{
                    padding: isSm ? "2rem 1rem" : "2rem 0",
                    width: "100%"
                }}>
                    <Typography variant="h6" sx={{ fontSize: "1rem", whiteSpace: 'pre-wrap', marginLeft: "1rem" }}>RECOMMENDED</Typography>

                    <Swiper
                        ref={swiperRef}
                        direction="horizontal"
                        slidesPerView={1}
                        spaceBetween={10}
                        navigation={!isSm}
                        // slidesOffsetBefore={-30}
                        style={{
                            display: 'flex',
                            width: "100%",
                            height: "fit-content",
                            padding: 0,
                            "--swiper-theme-color": theme.palette.primary.main,
                            "--swiper-pagination-color": theme.palette.primary.main,  // Active bullet color
                            "--swiper-pagination-bullet-inactive-color": "gray", // Inactive bullet color
                            "--swiper-pagination-bullet-inactive-opacity": "0.5",
                            "--swiper-navigation-size": 64,
                            "--swiper-navigation-top-offset": "calc(50% - 1rem)",
                        } as CSSProperties}
                        pagination={{
                            clickable: true,
                        }}
                        modules={[Pagination, Navigation]}
                        breakpoints={{
                            300: {
                                slidesPerView: 1.4,
                                spaceBetween: 10,
                            },
                            500: {
                                slidesPerView: 2.4,
                                spaceBetween: 0
                            },
                            1200: {
                                slidesPerView: 3.4,
                                spaceBetween: 10
                            },
                            1400: {
                                slidesPerView: 4.4,
                                spaceBetween: 10,
                            },
                            1800: {
                                slidesPerView: 5.4,
                                spaceBetween: 10,
                            },
                        }}
                        className="mySwiper"
                    >
                        {products && products.map(product => (

                            <SwiperSlide className="slide" key={product.id}>
                                <div className="flex center middle" style={{
                                    padding: isSm ? "1rem" : 0
                                }}>
                                    <ProductCard
                                        product={product}
                                        addToCart={props.Cart.add}
                                        style={{
                                            animationDelay: `${0}ms`,
                                            // width: "100%"
                                        }}
                                        categories={props.categories}
                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>


            </div >
        </>
    );
}
