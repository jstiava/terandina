import { SIZING_OPTIONS, StripePrice, StripeProduct } from "@/types"
import { Button, ButtonBase, Chip, IconButton, Typography, useTheme } from "@mui/material"
import CoverImageCarousel from "./CoverImageCarousel";
import { useEffect, useState } from "react";
import CoverImage from "./CoverImage";
import { AddOutlined, DeleteOutlined, MinimizeOutlined, Preview, RemoveOutlined } from "@mui/icons-material";
import { DisplayPrice } from "./ProductCard";
import PriceSelector from "./PriceSelector";
import { setConfig } from "next/config";
import { UseCart } from "@/checkout/useCart";
import Cart from "@/pages/cart";


export default function ProductInBagCard({
    product,
    removeFromCart,
    swap
}: {
    product: StripeProduct,
    removeFromCart?: UseCart['remove'],
    swap?: UseCart['swap']
}) {

    const theme = useTheme();

    const handleChangePrice = (newPrice: StripePrice) => {

        if (!swap) return;

        const newProduct: StripeProduct = {
            ...product,
            selectedPrice: newPrice
        }

        swap(product, newProduct);
    }

    const handleRemoveFromCart = () => {
        if (!removeFromCart) return;
        if (!product.selectedPrice) {
            return;
        }
        removeFromCart(product.selectedPrice.id);
    }

    const handleQuantityChange = (diff: number) => {
        if (!removeFromCart || !swap) return;

        const newValue = product.quantity + diff;

        if (!product.selectedPrice) {
            return;
        }

        if (newValue === 0) {
            removeFromCart(product.selectedPrice.id);
            return;
        }

        const newProduct = {
            ...product,
            quantity: newValue
        }

        swap(product, newProduct);

    }


    return (
        <ButtonBase className="flex between top"
            disableRipple
            style={{
                width: "100%",
                padding: "0.25rem"
            }}>
            {product.media && (
                <CoverImage
                    url={product.media[0].medium || ''}
                    width="5rem"
                    height="5rem"
                    style={{
                        borderRadius: "0.5rem",
                        overflow: 'hidden'
                    }} />
            )}
            <div className="column compact left" style={{
                width: "calc(100% - 6rem)"
            }}>
                    <div className="flex between top">

                        <div className="flex fit">
                            <Typography variant="h5" sx={{
                                fontSize: "1rem",
                                textAlign: 'left',
                                lineHeight: "115%"
                            }}>{product.name}</Typography>
                        </div>
                        {product.selectedPrice && product.quantity && (
                            <DisplayPrice product={product} style={{
                                fontSize: '1rem'
                            }} />
                        )}
                    </div>
                    {!swap && (
                        <Typography sx={{
                            textTransform: 'uppercase'
                        }}>{product.selectedPrice?.lookup_key}</Typography>
                    )}
                    <div className="flex between">
                        <div className="flex compact fit">
                            <IconButton onClick={() => handleQuantityChange(-1)}>
                                <RemoveOutlined fontSize="small" />
                            </IconButton>
                            <Typography>{product.quantity}</Typography>
                            <IconButton onClick={() => handleQuantityChange(1)}>
                                <AddOutlined fontSize="small" />
                            </IconButton>
                    {product.sizes && (
                        <div className="flex compact2 fit middle">
                            {/* TODO - Size */}
                        </div>
                    )}
                        </div>
                        {swap && removeFromCart && (
                            <div className="flex snug fit">
                                <IconButton onClick={handleRemoveFromCart}>
                                    <DeleteOutlined fontSize="small" color="error" />
                                </IconButton>
                            </div>
                        )}
                    </div>
                </div>
        </ButtonBase>
    )
}