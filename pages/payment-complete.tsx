import CastedProductInBagCard from "@/components/CastedProductInBagCard";
import { formatPrice } from "@/components/ProductCard";
import ProductInBagCard from "@/components/ProductInBagCard";
import { StripeAppProps, StripeProduct } from "@/types";
import { CheckCircleOutline, ChevronLeftOutlined, ChevronRightOutlined } from "@mui/icons-material";
import { Alert, Button, CircularProgress, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, useTheme } from "@mui/material";
import { RouteMatcher } from "next/dist/server/route-matchers/route-matcher";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";



export default function PaymentCompletePage(props: StripeAppProps) {

    const theme = useTheme();
    const router = useRouter();
    const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
    const [charge, setCharge] = useState<any | null>(null);
    const [taxAdded, setTaxAdded] = useState<number | null>(null);
    const [totalDue, setTotalDue] = useState(0);

    const [email, setEmail] = useState('');

    useEffect(() => {

        const { payment_intent, payment_intent_client_secret, redirect_status } = router.query;

        if (!payment_intent) {
            return;
        }

        // fetch(`/api/create-payment-intent?payment_intent=${payment_intent}`, {
        fetch(`/api/payment-complete?payment_intent=${payment_intent}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setCharge(data.charge);
                setTotalDue(data.charge.amount)
            })
            .catch(err => {
                console.log(err);
            });
    }, [router]);


    if (!charge) {

        return (
            <div className="flex center middle" style={{
                height: "100%"
            }}>
                <CircularProgress />
            </div>
        )
    }


    return (
        <div className="column relaxed center top"
            style={{
                width: "100%",
                padding: "20vh 0.5rem 0 0.5rem",
                height: "calc(100vh - 5rem)",
            }}>
            <div className="column center top">

                <CheckCircleOutline />
                <div className="column center compact">
                    <Typography variant="h1" sx={{
                        fontSize: "1rem",
                        lineHeight: "70%",
                        textAlign: 'center'
                    }}>Thank you for your purchase!</Typography>
                    <Typography sx={{
                        textAlign: 'center'
                    }}>We received your order and will ship to you in 7-14 business days.</Typography>

                    <Typography sx={{
                        textAlign: 'center'
                    }}>Check your email for updates.</Typography>
                </div>
            </div>
            <div className="column left top" style={{
                backgroundColor: '#fff',
                borderRadius: '0.25rem',
                padding: "1.5rem",
                width: "40rem",
                maxWidth: '95%',
                marginTop: "2rem"
            }}>
                <Typography variant="h5">Order Summary</Typography>

                {charge.products && charge.products.map((product: StripeProduct) => {
                    return (
                        <CastedProductInBagCard
                            product={product}
                            key={product.id}
                        />
                    )
                })}

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
                        {/*
                        <TableBody>
                            {charge.products.map((product, index) => {
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
                        {/* <TableRow>
                            <TableCell>SUBTOTAL</TableCell>
                            <TableCell>{formatPrice(subtotal, 'usd')}</TableCell>
                        </TableRow> */}
                        {/* <TableRow sx={{
                            opacity: 0.5
                        }}>
                            <TableCell>Shipping and Taxes included.</TableCell>
                            <TableCell></TableCell>
                        </TableRow> */}
                        <TableRow>
                            <TableCell sx={{ fontSize: "1rem" }}>Amount Recieved w/ taxes and shipping fees.</TableCell>
                            <TableCell sx={{ fontSize: "1rem" }}>{formatPrice(totalDue, 'usd')}</TableCell>
                        </TableRow>
                    </Table>
                </TableContainer>



            </div>
                <div className="flex right" style={{
                    padding: "0 1.5rem",
                width: "40rem",
                maxWidth: '95%',
                }}>
                    <Button onClick={e => {
                        router.push('/')
                    }} endIcon={<ChevronRightOutlined />} variant="text">Back to Home Page</Button>
                </div>
        </div>
    )
}