

import CoverImage from "@/components/CoverImage";
import PriceSelector from "@/components/PriceSelector";
import ProductCard, { DisplayPrice } from "@/components/ProductCard";
import { Category, SIZING_OPTIONS, StripeAppProps, StripePrice, StripeProduct } from "@/types";
import { Button, Chip, Divider, Link, Typography, useMediaQuery, useTheme } from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/router";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import CategoryVariantSelector from "@/components/CategoryVariantSelector";
import ScrollButton from "@/components/ScrollButton";
import Mongo from "@/utils/mongo";
import { getAllProducts } from "../api/products";
import { ObjectId, WithId } from "mongodb";
import { getAllCategories } from "../api/categories";
import { KeyboardArrowDown, KeyboardArrowUp, LocalShipping, LocalShippingOutlined, RecyclingOutlined } from "@mui/icons-material";

interface StaticProps {
    notFound?: boolean;
    product: StripeProduct;
    products: StripeProduct[];
    categories: Category[];
}

export const getStaticPaths = (async (context: any) => {

    const mongo = await Mongo.getInstance()
    const products = await mongo.clientPromise.db('products').collection('products').find().toArray();

    return {
        paths: products.map(p => ({
            params: {
                product_id: p.id,
            }
        })),
        fallback: "blocking"
    }
});

export const getStaticProps = (async (context: any) => {

    let products = null;
    const p_id = context.params.product_id;

    if (!p_id) {
        console.log("No product id.")
        return {
            notFound: true
        }
    }

    const mongo = await Mongo.getInstance();
    const [product] = await mongo.clientPromise.db('products').collection('products').find({ id: p_id }).toArray();

    if (!product) {
        return {
            notFound: true
        }
    }

    products = await getAllProducts({
        related_to: product._id.toString()
    });

    const categories = product.categories ? await getAllCategories({
        cat_ids: product.categories.map((c: ObjectId) => c.toString()),
    }, {
        getProductsIfVariant: true
    }) : [];

    if (!products) {
        return {
            notFound: true
        }
    }

    if (!categories) {
        return {
            notFound: true
        }
    }

    for (const c of categories) {

        if (!c.products) {
            continue;
        }
        console.log(c.products.map((p: any) => {
            return
        }))
    }

    for (const p of products) {
        if (!p.categories) {
            continue;
        }

        const cats = p.categories ? await getAllCategories({
            cat_ids: p.categories.map((c: ObjectId) => c.toString())
        }, {
            getProductsIfVariant: true
        }) : [];

        p.quantity = 1;
        p.selectedPrice = p.prices ? p.prices[0] : null;
        p.categories = cats;
    }


    const theStatic = {
        product: JSON.parse(JSON.stringify({
            ...product,
            quantity: 1,
            selectedPrice: product.prices ? product.prices[0] : null
        })),
        products: JSON.parse(JSON.stringify(products)),
        categories: JSON.parse(JSON.stringify(categories))
    }

    try {
        return {
            props: {
                static: theStatic,
            }
        }
    }
    catch (err) {
        console.log(err);
    }
})



export default function Home(props: StripeAppProps & {
    static: StaticProps
}) {

    const theme = useTheme();
    const router = useRouter();

    const product = props.static.product;
    const categories = props.static.categories;
    const products = props.static.products;

    const swiperRef = useRef<any>(null);
    const isSm = useMediaQuery(theme.breakpoints.down('sm'));
    const isMd = useMediaQuery(theme.breakpoints.down('md'));
    const [isDetailsShown, setIsDetailsShown] = useState(true);


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


    // const handleChangePrice = (newPrice: StripePrice) => {

    //     if (!product) {
    //         return;
    //     }
    //     setProduct(prev => {
    //         if (!prev) return null;
    //         return {
    //             ...prev,
    //             selectedPrice: newPrice
    //         }
    //     })
    // }

    const handleAddToCart = (e: any) => {
        e.stopPropagation();

        if (!product || !product.prices) {
            alert("Could not get prices for this item.")
            return;
        }
        props.Cart.add(product)
    }

    useEffect(() => {
        if (props && props.static) {
            if (props.static.notFound) {
                router.back();
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props]);


    if (!props || !props.static || !props.static.product) {
        return <></>
    }

    return (
        <>
            <Head>
                <title>{product.name} - Terandina - Handcrafted Native Outerwear and Accessories</title>
                <meta property="og:title" content={`${product.name} - Terandina - Handcrafted Native Outerwear and Accessories`} />
                <meta property="og:description" content={product.description || ""} />
                <meta property="og:image" content={product.media && product.media.length > 0 ? product.media[0].medium || '' : ''} />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
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
                                {product.media && product.media.length > 1 && (
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


                        <div className="column compact">


                            {product && categories && categories.some(c => c.type === 'variant') && categories.map(c => {

                                if (c.type != 'variant') {
                                    return null;
                                }

                                return (
                                    <div className="flex compact" key={c._id.toString()} style={{
                                        width: "calc(100% - 2rem)"
                                    }}>
                                        <CategoryVariantSelector
                                            key={c._id}
                                            category={c}
                                            product={product}
                                            onClose={() => {
                                                return;
                                            }}
                                            limit={c.products.length}
                                        />
                                    </div>
                                )
                            })}
                            {product.sizes && (
                                <div className="column right fit snug" style={{
                                    marginTop: "0.5rem"
                                }}>
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
                                                    variant={size === 'L' ? 'outlined' : 'filled'}
                                                    onDelete={undefined}
                                                    disabled={!marking}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        // setProduct(prev => {
                                                        //     if (!prev) return null;
                                                        //     return {
                                                        //         ...prev,
                                                        //         size
                                                        //     }
                                                        // })
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
                                    <Link>Size Guide</Link>
                                </div>
                            )}

                        </div>

                        <Button variant="outlined"
                            onClick={handleAddToCart}
                            fullWidth
                            sx={{
                                width: "100%"
                            }}>Add to Cart</Button>


                        {product.description && (
                            <>
                                <div className="column compact">
                                    <Typography variant="h6" sx={{ fontSize: "0.85rem", whiteSpace: 'pre-wrap' }}>DESCRIPTION</Typography>
                                    <Typography sx={{ fontSize: "0.85rem", whiteSpace: 'pre-wrap' }}>{product.description}</Typography>
                                </div>
                                <Divider />
                            </>
                        )}

                        {product.details && (
                            <>
                                <div className="column compact"
                                    onClick={() => { setIsDetailsShown(prev => !prev); }}
                                >
                                    <div className="flex between">
                                        <Typography variant="h6" sx={{ fontSize: "0.85rem", whiteSpace: 'pre-wrap' }}>DETAILS</Typography>
                                        {isDetailsShown ? (
                                            <KeyboardArrowUp sx={{
                                                fontSize: "1rem"
                                            }} />
                                        ) : (
                                            <KeyboardArrowDown sx={{
                                                fontSize: "1rem"
                                            }} />
                                        )}
                                    </div>
                                    {isDetailsShown && (
                                        <Typography sx={{ fontSize: "0.85rem", whiteSpace: 'pre-wrap' }}>{product.details}</Typography>
                                    )}
                                </div>
                                <Divider />
                            </>
                        )}

                        {product.dimensions && (
                            <>
                                <div className="column compact"
                                    onClick={() => { setIsDetailsShown(prev => !prev); }}
                                >
                                    <div className="flex between">
                                        <Typography variant="h6" sx={{ fontSize: "0.85rem", whiteSpace: 'pre-wrap' }}>DETAILS</Typography>
                                        {isDetailsShown ? (
                                            <KeyboardArrowUp sx={{
                                                fontSize: "1rem"
                                            }} />
                                        ) : (
                                            <KeyboardArrowDown sx={{
                                                fontSize: "1rem"
                                            }} />
                                        )}
                                    </div>
                                    {isDetailsShown && (
                                        <Typography sx={{ fontSize: "0.85rem", whiteSpace: 'pre-wrap' }}>{product.details}</Typography>
                                    )}
                                </div>
                                <Divider />
                            </>
                        )}

                        <>
                            <div className="flex"
                            >
                                <div className="column fit compact center">
                                    <RecyclingOutlined />
                                    <Typography sx={{
                                        fontSize: "1rem",
                                        textAlign: 'center',
                                        width: "9rem",
                                        lineHeight: "115%"
                                    }}>Ethical & Sustainable, Limited Quantities</Typography>
                                </div>
                                <div className="column fit compact center">
                                    <LocalShippingOutlined />
                                    <Typography sx={{
                                        fontSize: "1rem",
                                        textAlign: 'center',
                                        width: "10rem",
                                        lineHeight: "115%"
                                    }}>30-day Hassle-Free Returns and Exchanges</Typography>
                                </div>
                            </div>
                            <Divider />
                        </>

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
                                        disableSizing
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
