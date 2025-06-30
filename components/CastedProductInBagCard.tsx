import { SizeChart, SIZING_OPTIONS, StripePrice, StripeProduct } from "@/types"
import { Button, ButtonBase, Chip, FormControl, IconButton, MenuItem, Select, Typography, useMediaQuery, useTheme } from "@mui/material"
import CoverImageCarousel from "./CoverImageCarousel";
import { useEffect, useState } from "react";
import CoverImage from "./CoverImage";
import { AddOutlined, Delete, DeleteOutlined, MinimizeOutlined, Preview, RemoveOutlined } from "@mui/icons-material";
import { DisplayPrice } from "./ProductCard";
import PriceSelector from "./PriceSelector";
import { setConfig } from "next/config";
import { UseCart } from "@/checkout/useCart";
import Cart from "@/pages/cart";


export default function CastedProductInBagCard({
    product,
    removeFromCart,
    swap
}: {
    product: StripeProduct,
    removeFromCart?: UseCart['remove'],
    swap?: UseCart['swap']
}) {

    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down('sm'));
    const [isHovering, setIsHovering] = useState(false);

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
        removeFromCart(product.selectedPrice.id, product.size);
    }

    const handleQuantityChange = (diff: number) => {
        if (!removeFromCart || !swap) return;

        const newValue = product.quantity + diff;

        if (!product.selectedPrice) {
            return;
        }

        if (newValue === 0) {
            removeFromCart(product.selectedPrice.id, product.size);
            return;
        }

        const newProduct = {
            ...product,
            quantity: newValue
        }

        swap(product, newProduct);

    }

    const handleSizeChange = (newSize: keyof SizeChart) => {
        if (!removeFromCart || !swap) return;

        const newProduct = {
            ...product,
            size: newSize
        }

        swap(product, newProduct);
    }


    return (
        <ButtonBase className="flex between top"
            disableRipple
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
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
            <div className="column compact2 left" style={{
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
                <div className="flex between top">
                    <div className="flex left compact">
                       <Typography>{product.size}</Typography>
                        <Typography>-</Typography>
                        <Typography>{product.quantity} item(s)</Typography>

                    </div>
                </div>
            </div>
        </ButtonBase>
    )
}