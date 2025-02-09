import { StripePrice, StripeProduct } from "@/types"
import { Button, ButtonBase, IconButton, Typography, useTheme } from "@mui/material"
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
        removeFromCart(product.selectedPrice.id);
    }

    const handleQuantityChange = (diff: number) => {
        if (!removeFromCart || !swap) return;

        const newValue = product.quantity + diff;

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
            {product.images && (
                <CoverImage
                    url={product.images[0]}
                    width="5rem"
                    height="5rem"
                    style={{
                        borderRadius: "0.5rem",
                        overflow: 'hidden'
                    }} />
            )}
            <div className="flex between top"
                style={{ width: "calc(100% - 6rem)" }}
            >
                <div className="column compact left">
                    {swap && (
                        <PriceSelector product={product} handleChangePrice={handleChangePrice} />
                    )}
                    <Typography variant="h5" sx={{
                        textAlign: 'left',
                        lineHeight: "115%"
                    }}>{product.name}</Typography>
                    {!swap && (
                        <Typography sx={{
                            textTransform: 'uppercase'
                        }}>{product.selectedPrice.lookup_key}</Typography>
                    )}
                    <Typography>Quantity: {product.quantity}</Typography>
                </div>
                <div className="column snug right fit"
                >
                    {product.selectedPrice && product.quantity && (
                        <DisplayPrice product={product} />
                    )}
                    {swap && removeFromCart && (
                        <div className="flex snug">
                            <IconButton onClick={handleRemoveFromCart}>
                                <DeleteOutlined fontSize="small" />
                            </IconButton>
                            <IconButton onClick={() => handleQuantityChange(-1)}>
                                <RemoveOutlined fontSize="small" />
                            </IconButton>
                            <IconButton onClick={() => handleQuantityChange(1)}>
                                <AddOutlined fontSize="small" />
                            </IconButton>
                        </div>
                    )}
                </div>
            </div>
        </ButtonBase>
    )
}