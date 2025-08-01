import { UseCart } from "@/checkout/useCart";
import ProductInBagCard from "@/components/ProductInBagCard";
import { CloseOutlined, EnhancedEncryption, LockOutlined, ShoppingBagOutlined } from "@mui/icons-material";
import { Button, Card, Collapse, Divider, Drawer, IconButton, Typography, useMediaQuery, useTheme } from "@mui/material";
import { TransitionGroup } from 'react-transition-group';
import EmptyBag from '@/public/EmptyBag.webp'

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import NativeCrossDivider from "@/components/NativeCrossDivider";


export default function CartSidebar({
    Cart
}: {
    Cart: UseCart
}) {

    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down('sm'));
    const router = useRouter();



    useEffect(() => {
        // setConfirmed(new URLSearchParams(window.location.search).get(
        //     "payment_intent_client_secret"
        // ));
    }, []);

    // useEffect(() => {
    //     // Create PaymentIntent as soon as the page loads
    //     fetch("/api/create-payment-intent", {
    //         method: "POST",
    //         headers: { "Content-Type": "application/json" },
    //         body: JSON.stringify({ items: [{ id: "xl-tshirt" }] }),
    //     })
    //         .then((res) => res.json())
    //         .then((data) => setClientSecret(data.clientSecret))
    //         .catch(err => {
    //             console.log(err);
    //         });
    // }, []);



    return (
        <Drawer
            anchor="right"
            open={Cart.isSidebarOpen}
            onClose={Cart.toggleSidebar}
            sx={{
                '& .MuiDrawer-paper': {
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'absolute',
                    width: isSm ? '100vw' : '30rem',
                    right: 0,
                    top: 0,
                    height: `100dvh`,
                    overflow: "hidden",
                    backgroundColor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                    zIndex: 5
                },
            }}
        >
            <IconButton onClick={() => Cart.toggleSidebar()} sx={{
                position: "absolute",
                right: "0.5rem",
                top: "0.5rem"
            }}>
                <CloseOutlined />
            </IconButton>
            <div className="column center" style={{
                padding: "3rem 1.5rem"
            }}>
                <Typography sx={{
                    color: theme.palette.primary.main,
                    // top: "1rem",
                    // position: 'absolute'
                }}>Free Shipping for orders over $200</Typography>
                <div className="flex fit compact">
                    <Typography variant="h5" component="h3" sx={{
                        fontSize: "1.5rem"
                    }}>Your Cart</Typography>
                    <ShoppingBagOutlined sx={{
                        fontSize: "1rem"
                    }} />
                </div>
                <NativeCrossDivider />
                {!Cart.cart || Cart.cart.length === 0 ? (
                    <div className="column compact center middle" style={{
                        height: "100%"
                    }}>
                        <Typography>Bag is empty.</Typography>
                    </div>
                ) : (
                    <div className="column" style={{
                        width: "100%"
                    }}>
                                {Cart.cart.map(product => {
                                    if (!product.selectedPrice) {
                                        return null;
                                    }
                                    return (
                                        <ProductInBagCard 
                                        key={`${product.id}_${product.selectedPrice.id}_${product.size}`} 
                                        product={product} 
                                        removeFromCart={Cart.remove} 
                                        swap={Cart.swap}
                                        />
                                    )
                                })}
                    </div>
                )}
                <div className="column compact center" style={{
                    position: 'absolute',
                    bottom: 'var(--safe-area-inset-bottom, 0px)',
                    height: 'fit-content',
                    padding: "1rem",
                    width: "100%"
                }}>
                    {/* <Button
                        onClick={e => {
                            Cart.clear();
                        }}
                    >Empty cart.</Button> */}
                    <Button
                    fullWidth
                        variant="contained"
                        disabled={!Cart.cart || Cart.cart.length === 0}
                        onClick={() => {
                            router.push('/checkout');
                            Cart.toggleSidebar();
                        }}>Continue to Checkout</Button>
                        <div className="flex middle fit compact">
                            <LockOutlined sx={{
                                fontSize: "0.75rem"
                            }}/>
                            <Typography variant="caption" sx={{
                                padding: 0
                            }}>Secured by Stripe</Typography>
                        </div>
                </div>
            </div>
        </Drawer>
    )
}