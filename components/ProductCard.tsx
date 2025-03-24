import { Category, SizeChart, SIZING_OPTIONS, StripePrice, StripeProduct } from "@/types"
import { Accordion, AccordionDetails, AccordionSummary, Avatar, AvatarGroup, Button, ButtonBase, Chip, Drawer, lighten, Typography, useMediaQuery, useTheme } from "@mui/material"
import CoverImageCarousel from "./CoverImageCarousel";
import { CSSProperties, Fragment, useEffect, useState } from "react";
import PriceSelector from "./PriceSelector";
import { UseCart } from "@/checkout/useCart";
import { ArrowForward, ArrowRightOutlined, ExpandMore, Preview } from "@mui/icons-material";
import { Router, useRouter } from "next/router";
import CategoryVariantSelector from "./CategoryVariantSelector";

export const formatPrice = (price: number | null, currency: string): string => {

    try {
        if (!price || !currency) {
            return ""
        }

        return new Intl.NumberFormat(undefined, {
            style: "currency",
            currency,
        }).format(price / 100);

    }
    catch (err) {
        console.error(err);
        return "";
    }
}


export function DisplayPrice({
    product,
    style = {}
}: {
    product: StripeProduct,
    style?: CSSProperties
}) {

    const theme = useTheme();

    if (!product.selectedPrice || !product.selectedPrice.unit_amount) {
        return (
            <Typography sx={{
                fontSize: "1.25rem",
                color: theme.palette.primary.light,
                width: "fit-content",
                textAlign: "right",
                lineHeight: "115%",
                ...style
            }}>--</Typography>
        )
    }

    return (
        <Typography sx={{
            fontSize: "1.25rem",
            color: theme.palette.primary.light,
            width: "fit-content",
            textAlign: "right",
            lineHeight: "115%",
            ...style
        }}>{formatPrice(product.selectedPrice.unit_amount * product.quantity, product.selectedPrice.currency)}</Typography>
    )
}

export default function ProductCard({
    product,
    addToCart,
    style = {},
    ...props
}: {
    product: StripeProduct,
    addToCart?: UseCart['add'],
    style?: CSSProperties,
    categories?: Category[] | null
}) {

    const router = useRouter();
    const theme = useTheme();
    const [expanded, setExpanded] = useState(false);
    const isSm = useMediaQuery(theme.breakpoints.down('sm'));
    const isMd = useMediaQuery(theme.breakpoints.down('md'));
    const [isHovering, setIsHovering] = useState(false);
    const [isVariantMenuOpen, setIsVariantMenuOpen] = useState(false);

    const [categories, setCategories] = useState<Category[] | null>(null);

    const [copyOfProduct, setCopyOfProduct] = useState(product);

    const getCategories = async (pro: StripeProduct) => {

        let theCats: Category[] = [];

        for (const cat_id of product.categories) {
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

    useEffect(() => {
        if (!product.prices || product.prices.length === 0) {
            return;
        }

        if (props.categories && product.categories) {
            getCategories(product)
        }

        setCopyOfProduct({
            ...product,
            selectedPrice: product.prices[0]
        })
    }, [product]);


    const handleAddToCart = (e: any) => {
        e.stopPropagation();
        if (!addToCart) {
            return;
        }
        if (!product || !product.prices) {
            alert("Could not get prices for this item.")
            return;
        }
        addToCart(copyOfProduct)
    }

    const handleChangePrice = (newPrice: StripePrice) => {
        setCopyOfProduct(prev => ({
            ...prev,
            selectedPrice: newPrice
        }))
    }

    return (
        <ButtonBase className="column left top"
            disableRipple
            onMouseEnter={() => {
                if (!isSm) {
                    setIsHovering(true);
                }
            }}
            onMouseLeave={() => setIsHovering(false)}
            onClick={() => router.push(`/item/${product.id}`)}
            style={{
                width: isSm ? "100%" : "25rem",
                padding: isSm ? "0" : "2rem",
                animation: `popIn 0.5s ease forwards`,
                transform: "scale(0)",
                opacity: 0,
                marginBottom: "2rem",
                ...style
            }}>
            {product.media && (
                <div className="column snug center"

                    style={{
                        position: 'relative',
                        width: "100%"
                    }}>
                    <CoverImageCarousel
                        images={product.media}
                        width="100%"
                        height={"100%"}
                        isHovering={isHovering}
                        style={{
                            // borderRadius: "0.5rem",
                            aspectRatio: "1 / 1",
                            height: "auto",
                            overflow: 'hidden'
                        }} />
                    {isHovering && addToCart && (
                        <Button variant="contained"
                            onClick={handleAddToCart}
                            fullWidth
                            sx={{
                                position: 'absolute',
                                bottom: "0.75rem",
                                width: "90%"
                            }}>Add to Cart</Button>
                    )}
                </div>
            )}
            <div className={"flex between top"}
                style={{
                    opacity: isHovering ? 0.85 : 1,
                    transition: "0.25s ease-in-out",
                }}
            >
                <div className={isMd ? "column compact" : "flex between top"} >
                    <div className="column compact">
                        <PriceSelector
                            product={copyOfProduct}
                            handleChangePrice={handleChangePrice}
                        />


                        <Typography variant="h5" sx={{
                            width: "fit-content",
                            lineHeight: "115%",
                            textAlign: 'left',
                            fontSize: "1rem",
                            minHeight: '2rem',
                            height: isSm ? "3.5rem" : 'fit-content',
                            overflow: 'hidden',
                            whiteSpace: 'wrap',
                            textOverflow: 'ellipsis',
                            lineClamp: 3,
                            display: '-webkit-flex',
                            WebkitLineClamp: 3

                        }}>{product.name}</Typography>

                        {!isSm && product.sizes && (
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
                                            size="small"
                                            key={size}
                                            label={size}
                                            onDelete={undefined}
                                            disabled={!marking}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setCopyOfProduct(prev => ({
                                                    ...prev,
                                                    size
                                                }))
                                            }}
                                            sx={{
                                                marginBottom: "0.25rem",
                                                overflow: 'hidden',
                                                backgroundColor: size === copyOfProduct.size ? theme.palette.divider : 'transparent'
                                            }}
                                        />
                                    )


                                })}
                            </div>
                        )}

                        {!isSm && (
                            <div className="flex between">
                                <div className="flex compact">
                                    {product && categories && categories.map((c, i) => {

                                        if (c.type === 'variant') {

                                            return (
                                                <CategoryVariantSelector
                                                    key={c._id}
                                                    category={c}
                                                    product={product}
                                                    size='small'
                                                    onMore={() => {
                                                        setIsVariantMenuOpen(true);
                                                    }}
                                                    onClose={() => {
                                                        setIsVariantMenuOpen(false);
                                                    }}
                                                />
                                            )
                                        }
                                        return null
                                    })}
                                </div>

                            </div>
                        )}
                    </div>

                    <DisplayPrice product={copyOfProduct} style={{
                        fontSize: '1rem'
                    }} />

                </div>
                <div className={"flex fit"}>
                    {isSm && product && categories ? (
                        <div className="flex fit">
                            {categories.map(c => {

                                if (c.type === 'variant') {
                                    return (
                                        <Fragment key={c._id}>
                                            <AvatarGroup spacing={36} max={2} total={2}
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    setIsVariantMenuOpen(true);
                                                }}
                                                sx={{
                                                    marginLeft: "0.5rem"
                                                }}
                                            >
                                                {c.products.map(p => {

                                                    return (
                                                        <Avatar key={p.id} alt={p.name} src={p.media[0].small || ''} />
                                                    )
                                                })}
                                            </AvatarGroup>
                                        </Fragment>
                                    )
                                }

                                return null;
                            })}
                        </div>

                    ) : (
                        <></>
                    )}
                </div>
            </div>
            <div className="flex between">
                {isSm && addToCart && (
                    <Button variant="contained"
                        onClick={handleAddToCart}
                        fullWidth
                        sx={{
                            height: "2.5rem"
                        }}>Add to Cart</Button>
                )}
            </div>
            <Drawer anchor={isMd ? 'bottom' : 'right'} open={isVariantMenuOpen}
                onClose={(e: any, reason) => {
                    e.stopPropagation();
                    setIsVariantMenuOpen(false)
                }}
                onClick={e => {
                    e.stopPropagation();
                }}
            >
                <div className="column" style={{
                    padding: "2rem 0",
                    backgroundColor: 'white',
                    width: isMd ? "100%" : "30rem",
                    maxWidth: "100%",
                    height: "100%"
                }}>

                    <div className="column" style={{
                        padding: "0 1rem"
                    }}>

                        {categories && categories.map(c => {

                            if (c.type === 'variant') {

                                return (
                                    <Fragment key={c._id}>
                                        <Typography variant="h6" sx={{
                                            textTransform: "uppercase",
                                            opacity: 0.75,
                                            fontSize: "1rem"
                                        }}>{c.name}</Typography>
                                        <div className="column snug">
                                            {c.products.map((p: any) => {
                                                return (
                                                    <ButtonBase
                                                        key={p.id}
                                                        className="flex between"
                                                        onClick={e => {
                                                            e.stopPropagation();
                                                            setIsVariantMenuOpen(false);
                                                            router.push(`/item/${p.id}`)
                                                        }}
                                                        style={{
                                                            padding: "0.5rem 0.75rem 0.5rem 0.5rem",
                                                            backgroundColor: p.id === product.id ? lighten(theme.palette.primary.main, 0.9) : 'white',
                                                            borderRadius: "0.25rem"
                                                        }}>
                                                        <div className="flex compact">
                                                            <Avatar key={p.id} alt={p.name} src={p.media[0].small || ''} />
                                                            <Typography sx={{
                                                                fontSize: "1rem"
                                                            }}>{p.name}</Typography>
                                                        </div>
                                                        <ArrowForward fontSize="small" sx={{
                                                            opacity: 0.75
                                                        }} />
                                                    </ButtonBase>
                                                )
                                            })}
                                        </div>
                                    </Fragment>
                                )
                            }

                            return null;
                        })}
                    </div>
                    <div className="column">
                        <Accordion
                            expanded={expanded}
                            onChange={(e) => setExpanded(prev => !prev)}
                            disableGutters
                            elevation={0}
                            square
                            sx={{
                                backgroundColor: "white"
                            }}
                        >
                            <AccordionSummary
                                {...props}
                                expandIcon={<ExpandMore />}
                                aria-controls="panel1-content"
                                id="panel1-header"
                                sx={{
                                    '& .MuiAccordionSummary-content': {
                                        width: "calc(100% - 5rem)",
                                        backgroundColor: 'transparent'
                                    }
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '0.25rem 0.25rem 0.25rem 0',
                                        height: '2rem',
                                        width: "100%",
                                    }}
                                >
                                    <Typography variant="h6" sx={{
                                            textTransform: "uppercase",
                                            opacity: 0.75,
                                            fontSize: "1rem"
                                        }}>Related</Typography>

                                </div>
                            </AccordionSummary>
                            <AccordionDetails>
                                <div className="column" >
                                    {categories && categories.map((c, i) => {

                                        if (c.type === 'variant') {
                                            return null;
                                        }

                                        return (
                                            <ButtonBase
                                                key={c._id}
                                                className="flex between"
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    router.push(`/${c.slug}`);
                                                    setIsVariantMenuOpen(false);
                                                }}
                                                style={{
                                                    padding: "0.5rem 0.75rem 0.5rem 0.5rem",

                                                    borderRadius: "0.25rem"
                                                }}>
                                                <div className="flex compact">
                                                    <Typography sx={{
                                                        fontSize: "1rem"
                                                    }}>{c.name}</Typography>
                                                </div>
                                                <ArrowForward fontSize="small" sx={{
                                                    opacity: 0.75
                                                }} />
                                            </ButtonBase>
                                        )
                                    })}
                                </div>
                            </AccordionDetails>
                        </Accordion>
                    </div>
                </div>
            </Drawer>
        </ButtonBase>
    )
}