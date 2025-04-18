import { Link, Typography } from "@mui/material";
import Head from "next/head";


export default function OurValuesPage() {


    return (
        <>
            <Head>
                <title>Return Policy - Terandina - Handcrafted Native Outerwear and Accessories</title>
            </Head>
            <div className="column center"
                style={{
                    width: "100%",
                    padding: "0",
                    marginTop: "4rem",
                }}>

                <div className="column relaxed center" style={{
                    maxWidth: "45rem",
                    width: "100%",
                    padding: "4rem 2rem"
                }}>

                    <Typography variant="h1">Return Policy</Typography>

                    <Typography variant="body1" sx={{
                        lineHeight: '2rem',
                        // textAlign: 'justify'
                    }}>
                        If you are not satisfied with your purchase, we are happy to offer returns and exchanges within 30 days of the delivery date.
                        To be eligible, items must be returned in original condition – unworn, unaltered, unwashed, and with all original tags still attached.<br/><br/>
                        To initiate a return/exchange, please contact <Link href={"mailto:terandina.info@gmail.com"}>terandina.info@gmail.com</Link> with your order number and reason for return. We will review your request and provide further instructions on how to return/exchange your product.<br/><br/>
                        Refunds will be processed within 5-7 business days after we receive the returned item. It may take an additional 2-3 business days for your bank account to reflect the refund.<br/><br/>
                        <strong>Please note:</strong> Original shipping fees are non-refundable. Return shipping costs are the responsibility of the customer.
                    </Typography>

                </div>

            </div>
        </>
    );
}