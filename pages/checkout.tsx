"use client"
import { StripeAppProps } from "@/types";
import { AddressElement, Elements } from '@stripe/react-stripe-js';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import StripeCheckoutForm from "@/components/StripeCheckoutForm";
import { useEffect, useState } from "react";
import { Alert, AlertTitle, Button, Checkbox, Collapse, Divider, FormControlLabel, FormGroup, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, TextField, Typography, useMediaQuery, useTheme } from "@mui/material";
import ProductInBagCard from "@/components/ProductInBagCard";
import { ContactMail, ContactMailOutlined, EditOutlined, LocalShippingOutlined, PaymentOutlined, ShoppingBagOutlined } from "@mui/icons-material";
import { TransitionGroup } from 'react-transition-group';
import Cart from "./cart";
import StripeCompletePage from "@/components/StripeCompletePage";
import { formatPrice } from "@/components/ProductCard";
import { Router, useRouter } from "next/router";
import NativeCrossDivider from "@/components/NativeCrossDivider";

// const STRIPE_PUBLISHABLE_KEY = "pk_test_51QoxC5BNjcHRVZ2aSGjCO486T5HmE7E9Y7cWKHUABEJF6zdNJBnDu3jaDzfDqLDJLhGl2iuTNLdRktTFdc84rPqU00cfj7qfyE"

// const STRIPE_PUBLISHABLE_KEY = "pk_live_51QoxC5BNjcHRVZ2aQUGaPzUW5mIja4EGElNvfdaX02k7b19XQxkfXZRIKQui5yvysoAGmVkzQiguD1Sa2ecFfPN1003naOOVuP"
const STRIPE_PUBLISHABLE_KEY = "pk_test_51Qowqz2fAdlAQ5MweSGCb2wcG280BpGKbGdhbu7S0G6crzt0wnNbSsyRPHnKzoPJlgenidrF1N4l52RO2NQMseWf00gkbpgwFz"
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

export default function Checkout(props: StripeAppProps) {

    const theme = useTheme();
    const router = useRouter();
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [confirmed, setConfirmed] = useState(false);
    const [subtotal, setSubtotal] = useState(0);
    const [totalDue, setTotalDue] = useState(0);
    const [emailAddress, setEmailAddress] = useState<string | null>(null);
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
                setTotalDue(data.totalDue)
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
            variables: {
                colorPrimary: '#550e00',
                colorBackground: '#f4f4f4',
                colorText: '#30313d',
                colorDanger: '#df1b41',
                fontFamily: 'Ideal Sans, system-ui, sans-serif',
                spacingUnit: '0.25rem',
                borderRadius: '0.25rem',
            }
        },
    } as StripeElementsOptions;

    if (!options || !clientSecret || !stripePromise) {
        return null;
    }

    return (
        <Elements options={options} stripe={stripePromise}>
            <div className="column center" style={{
                width: "100%",
                padding: "3rem 1rem",
                marginTop: !isSm ? '5rem' : '2rem'
            }}>
                <div className={isSm ? "column relaxed" : "flex relaxed top between"} style={{
                    maxWidth: "70rem",
                    width: "100%",
                    padding: "1rem"
                }}>
                    <div className="column relaxed" style={{
                        width: isSm ? "100%" : "45%",
                        position: !isSm ? "sticky" : 'relative',
                        top: !isSm ? "9rem" : 'unset',
                    }}>
                        <div className="column compact left">
                            <div className="flex fit compact">
                                <ShoppingBagOutlined sx={{
                                    fontSize: "1rem"
                                }} />
                                <Typography variant="h5" component="h3" sx={{
                                    fontSize: "1rem"
                                }}>Order Summary</Typography>
                            </div>
                            <NativeCrossDivider />
                            {!props.Cart.cart || props.Cart.cart.length === 0 ? (
                                <Typography>Cart is empty.</Typography>
                            ) : (
                                <div className="column" style={{
                                    width: "100%"
                                }}>
                                    <TableContainer>
                                        <Table sx={{
                                            width: "100%"
                                        }}>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell sx={{
                                                        width: "calc(100% - 1rem)"
                                                    }}>Product</TableCell>
                                                    <TableCell sx={{
                                                        width: "1rem"
                                                    }}>Price</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {props.Cart.cart.map((product, index) => {
                                                    if (!product.selectedPrice || !product.selectedPrice.unit_amount) {
                                                        return <Alert key={index}>
                                                            <Typography>{product.name} could not be processed through cart.</Typography>
                                                        </Alert>
                                                    }
                                                    return (
                                                        <TableRow key={index}>
                                                            <TableCell sx={{
                                                                width: "calc(100% - 1rem)"
                                                            }}>{product.quantity} &middot; {product.name}{product.size && (
                                                                <>
                                                                    <br />
                                                                    <span style={{
                                                                        opacity: 0.5
                                                                    }}>Size: {product.size}</span>
                                                                </>
                                                            )}</TableCell>
                                                            <TableCell sx={{
                                                                width: "1rem",
                                                                verticalAlign: 'top'
                                                            }}>{formatPrice(product.selectedPrice.unit_amount * product.quantity, product.selectedPrice.currency)}</TableCell>
                                                        </TableRow>
                                                    )
                                                })}
                                            </TableBody>
                                            <TableRow>
                                                <TableCell>SUBTOTAL</TableCell>
                                                <TableCell>{formatPrice(subtotal, 'usd')}</TableCell>
                                            </TableRow>
                                            {subtotal === totalDue ? (
                                                <TableRow sx={{
                                                    opacity: 0.5
                                                }}>
                                                    <TableCell>Shipping (7-14 business days)</TableCell>
                                                    <TableCell>FREE</TableCell>
                                                </TableRow>
                                            ) : (
                                                <TableRow sx={{
                                                    opacity: 0.5
                                                }}>
                                                    <TableCell>Shipping (7-14 business days)</TableCell>
                                                    <TableCell>{formatPrice(totalDue - subtotal, 'usd')}</TableCell>
                                                </TableRow>
                                            )}
                                            <TableRow>
                                                <TableCell sx={{ fontSize: "2rem" }}>Total due</TableCell>
                                                <TableCell sx={{ fontSize: "2rem" }}>{formatPrice(totalDue, 'usd')}</TableCell>
                                            </TableRow>
                                        </Table>
                                    </TableContainer>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="column relaxed" style={{ width: isSm ? "100%" : "45%" }}>
                        {/* <div className="flex fit compact">
                        <Typography variant="h5" component="h3" sx={{
                            fontSize: "2.5rem"
                        }}>Delivery</Typography>
                        <LocalShippingOutlined sx={{
                            fontSize: "1.5rem"
                        }} />
                    </div> */}
                        <div className="column">
                            <div className="flex fit compact">
                                <LocalShippingOutlined sx={{
                                    fontSize: "1rem"
                                }} />
                                <Typography variant="h5" component="h3" sx={{
                                    fontSize: "1rem"
                                }}>Shipping (2-3 weeks)</Typography>
                            </div>
                            <NativeCrossDivider />
                            <AddressElement
                                id="address-element"
                                options={{
                                    mode: 'shipping',
                                }}
                            />
                        </div>
                        <div className="column">
                            <div className="flex fit compact">
                                <ContactMailOutlined
                                    sx={{
                                        fontSize: "1rem"
                                    }} />
                                <Typography variant="h5" component="h3" sx={{
                                    fontSize: "1rem"
                                }}>Contact</Typography>
                            </div>
                            <NativeCrossDivider />
                            <TextField
                                label="Email Address"
                                value={emailAddress}
                                onChange={(e) => {
                                    setEmailAddress(e.target.value);
                                }}
                            />
                            <FormGroup>
                                <FormControlLabel required control={<Checkbox checked={true} />} label="Delivery Tracking" />
                                <FormControlLabel control={<Checkbox />} label="Marketing Updates" />
                            </FormGroup>
                        </div>
                        <div className="column">
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
                                        <div className="column">
                                            <StripeCheckoutForm
                                                subtotal={formatPrice(totalDue, 'usd')}
                                                emailAddress={emailAddress}
                                            />
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Elements>
    )
}