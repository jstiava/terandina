"use client"
import { StripeAppProps } from "@/types";
import { AddressElement, Elements } from '@stripe/react-stripe-js';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import StripeCheckoutForm from "@/components/StripeCheckoutForm";
import { useEffect, useState } from "react";
import { Alert, AlertTitle, Button, Collapse, Divider, Typography, useMediaQuery, useTheme } from "@mui/material";
import ProductInBagCard from "@/components/ProductInBagCard";
import { EditOutlined, LocalShippingOutlined, PaymentOutlined, ShoppingBagOutlined } from "@mui/icons-material";
import { TransitionGroup } from 'react-transition-group';
import Cart from "./cart";
import StripeCompletePage from "@/components/StripeCompletePage";
import { formatPrice } from "@/components/ProductCard";
import { Router, useRouter } from "next/router";


const STRIPE_PUBLISHABLE_KEY = "pk_live_51QoxC5BNjcHRVZ2aQUGaPzUW5mIja4EGElNvfdaX02k7b19XQxkfXZRIKQui5yvysoAGmVkzQiguD1Sa2ecFfPN1003naOOVuP"
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

export default function Checkout(props: StripeAppProps) {

    const theme = useTheme();
    const router = useRouter();
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [confirmed, setConfirmed] = useState(false);
    const [subtotal, setSubtotal] = useState(0);
    const isSm = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        // Create PaymentIntent as soon as the page loads
        console.log("Create payment intent")
        fetch("/api/create-payment-intent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items: props.Cart.checkout() }),
        })
            .then((res) => res.json())
            .then((data) => {
                setClientSecret(data.clientSecret)
                setSubtotal(data.subtotal)
            })
            .catch(err => {
                console.log(err);
            });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const options = {
        clientSecret,
        appearance: {
            theme: "stripe",
        },
    } as StripeElementsOptions;

    if (!options || !clientSecret || !stripePromise) {
        return null;
    }

    return (
        <Elements options={options} stripe={stripePromise}>
            <div className="column center" style={{
                width: "100%",
                padding: "3rem 1rem"
            }}>
                <div className={isSm ? "column relaxed" : "flex relaxed top between"} style={{
                    maxWidth: "70rem",
                    width: "100%",
                    padding: "1rem"
                }}>
                    <div className="column relaxed" style={{
                        width: isSm ? "100%" : "45%"
                    }}>
                        <div className="column compact">
                            <div className="flex between">

                                <div className="flex fit compact">
                                    <ShoppingBagOutlined sx={{
                                        fontSize: "1rem"
                                    }} />
                                    <Typography variant="h5" component="h3" sx={{
                                        fontSize: "1rem"
                                    }}>Order Summary</Typography>
                                </div>
                                <Button
                                    size="small"
                                    sx={{
                                        height: "2rem"
                                    }}
                                    variant="outlined"
                                    startIcon={<EditOutlined />}
                                    onClick={() => router.push('/')}
                                >Edit</Button>
                            </div>
                            <Divider style={{
                                width: "100%"
                            }} ></Divider>
                            {!props.Cart.cart || props.Cart.cart.length === 0 ? (
                                <Typography>Cart is empty.</Typography>
                            ) : (
                                <div className="column" style={{
                                    width: "100%"
                                }}>
                                    <TransitionGroup>
                                        <Collapse>
                                            {props.Cart.cart.map(product => {
                                                return (
                                                    <ProductInBagCard key={product.id} product={product} />
                                                )
                                            })}
                                        </Collapse>
                                    </TransitionGroup>
                                    <Divider style={{
                                        width: "100%"
                                    }} ></Divider>
                                    <div className="flex between" style={{
                                        opacity: "0.9"
                                    }}>
                                        <Typography>SUBTOTAL</Typography>
                                        <Typography sx={{
                                            fontSize: "1.25rem",
                                            color: theme.palette.primary.light,
                                            width: "fit-content",
                                            maxWidth: "5rem",
                                            textAlign: "right"
                                        }}>{formatPrice(subtotal, 'usd')}</Typography>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="column">
                            <div className="flex fit compact">
                                <LocalShippingOutlined sx={{
                                    fontSize: "1rem"
                                }} />
                                <Typography variant="h5" component="h3" sx={{
                                    fontSize: "1rem"
                                }}>Shipping</Typography>
                            </div>
                            <Divider style={{
                                width: "100%"
                            }} ></Divider>
                            <AddressElement
                                id="address-element"
                                options={{
                                    mode: 'shipping'
                                }}
                            />
                        </div>
                    </div>

                    <div className="column compact" style={{ width: isSm ? "100%" : "45%" }}>
                        {/* <div className="flex fit compact">
                        <Typography variant="h5" component="h3" sx={{
                            fontSize: "2.5rem"
                        }}>Delivery</Typography>
                        <LocalShippingOutlined sx={{
                            fontSize: "1.5rem"
                        }} />
                    </div> */}
                        <div className="flex fit compact">
                            <PaymentOutlined sx={{
                                fontSize: "1rem"
                            }} />
                            <Typography variant="h5" component="h3" sx={{
                                fontSize: "1rem"
                            }}>Checkout</Typography>
                        </div>
                        {clientSecret && (
                            <>
                                {confirmed ? <StripeCompletePage /> : (
                                    <StripeCheckoutForm />
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </Elements>
    )
}