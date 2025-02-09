import { StripeAppProps } from "@/types";
import { Elements } from '@stripe/react-stripe-js';
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


const STRIPE_PUBLISHABLE_KEY = "pk_test_51QmLSsJrcLUH8C2zE5oCKsMmM7N1bATycweqAgVJWL5n1DjO7CdEmPliVKi9lAYQbEIUawdZurjGdQjz7xoCTXz400xuStJ6Eo"
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

    return (
        <div className="column center" style={{
            width: "100%",
            padding: "3rem 1rem"
        }}>
            <div className={isSm ? "column relaxed" : "flex relaxed top between"} style={{
                maxWidth: "70rem",
                width: "100%",
                padding: "1rem"
            }}>
                <div className="column compact" style={{
                    width: isSm ? "100%" : "45%"
                }}>
                    <div className="flex between">

                        <div className="flex fit compact">
                            <Typography variant="h5" component="h3" sx={{
                                fontSize: "2.5rem"
                            }}>Order Summary</Typography>
                            <ShoppingBagOutlined sx={{
                                fontSize: "1.5rem"
                            }} />
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
                        <Typography variant="h5" component="h3" sx={{
                            fontSize: "2.5rem"
                        }}>Checkout</Typography>
                        <PaymentOutlined sx={{
                            fontSize: "1.5rem"
                        }} />
                    </div>
                    {clientSecret && (
                        <Elements options={options} stripe={stripePromise}>
                            {confirmed ? <StripeCompletePage /> : (
                                <StripeCheckoutForm />
                            )}
                        </Elements>
                    )}
                </div>
            </div>
        </div>
    )
}