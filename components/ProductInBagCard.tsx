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
                <div className="flex between top">
                    <div className="column snug left">
                        {product.sizes && (
                            <FormControl fullWidth size="small" onClick={(e) => {
                                e.stopPropagation();
                            }}>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={product.size}
                                    label="Size"
                                    sx={{
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            border: 'none'
                                        }
                                    }}
                                    onChange={(e: any) => {
                                        e.stopPropagation();
                                        if (!e.target.value) {
                                            return;
                                        }
                                        handleSizeChange(e.target.value);
                                    }}
                                >
                                    {SIZING_OPTIONS.map((size: keyof SizeChart) => {
                                        const marking = product.sizes && typeof product.sizes === 'object' ? product.sizes[size] : null;

                                        const doesNotExist = marking === undefined || marking === null;

                                        if (doesNotExist) {
                                            return;
                                        }

                                        return (
                                            <MenuItem key={size} value={size} disabled={!marking}>{size}</MenuItem>
                                        )
                                    })}
                                </Select>
                            </FormControl>
                        )}
                        <div className="flex compact fit">
                            <IconButton onClick={() => handleQuantityChange(-1)}>
                                <RemoveOutlined fontSize="small" />
                            </IconButton>
                            <Typography>{product.quantity}</Typography>
                            <IconButton onClick={() => handleQuantityChange(1)}>
                                <AddOutlined fontSize="small" />
                            </IconButton>
                        </div>

                    </div>
                    {(swap && removeFromCart) && (isHovering || isSm) && (
                        <div className="flex snug fit">
                            <Button
                                onClick={handleRemoveFromCart}
                                startIcon={<DeleteOutlined fontSize="small" color="error" />}
                                color="error"
                                sx={{
                                    height: "2rem"
                                }}
                            >
                                Remove
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </ButtonBase>
    )
}