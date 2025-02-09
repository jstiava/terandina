import { StripeAppProps } from "@/types";
import { Button, TextField, Typography, useTheme } from "@mui/material";
import { RouteMatcher } from "next/dist/server/route-matchers/route-matcher";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";



export default function PaymentCompletePage(props: StripeAppProps) {

    const theme = useTheme();
    const router = useRouter();
    const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
    const [email, setEmail] = useState('');

    useEffect(() => {

        const { payment_intent, payment_intent_client_secret, redirect_status } = router.query;

        if (!payment_intent) {
            return;
        }

        fetch(`/api/create-payment-intent?payment_intent=${payment_intent}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setReceiptUrl(data.receipt_url);
            })
            .catch(err => {
                console.log(err);
            });
    }, [router])


    return (
        <div className="column relaxed center top"
            style={{
                width: "100%",
                padding: "15vh 0.5rem 0 0.5rem",
                height: "calc(100vh - 5rem)",
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText
            }}>

            <Typography variant="h1" sx={{
                fontSize: "8rem",
                lineHeight: "70%",
                textAlign: 'center'
            }}>Success!</Typography>
            <Typography variant="h2" sx={{
                textAlign: 'center'
            }}>We successfully received your order.</Typography>
            <div className="flex fit">
                <Button variant="flipped" onClick={() => router.push('/')}>
                    Continue to Home Page
                </Button>
                {receiptUrl && (
                    <Button variant="contained" onClick={() => window.open(receiptUrl, '_blank')}>
                        View receipt
                    </Button>
                )}
            </div>
        </div>
    )
}