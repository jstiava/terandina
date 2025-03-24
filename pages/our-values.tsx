import { Typography } from "@mui/material";
import Head from "next/head";


export default function OurValuesPage() {


    return (
        <>
            <Head>
                <title>Our Values - Terandina - Handcrafted Native Outerwear and Accessories</title>
            </Head>
            <div className="column center"
                style={{
                    width: "100%",
                    padding: "0",
                    marginTop: "4rem"
                }}>

                <div className="column relaxed center" style={{
                    maxWidth: '30rem',
                    width: "100%",
                    padding: "4rem 2rem"
                }}>

                    <Typography variant="h1">Our Values</Typography>

                    <Typography variant="body1" sx={{
                        lineHeight: '2rem'
                    }}>
                        Welcome to Terandina! We are a 100% Native-owned business who specialize in authentic native wear that connects people to the beauty and history of Native artistry. Our products are handmade by skilled native artisans from the Andean region.

                        We offer an exquisite collection of ponchos, hoodies, and more, made with real alpaca and organic wool. Our promise to you is ultimate comfort and style made with sustainable and durable materials.

                        We are proud to collaborate with Native American artists from both North and South America to bring their exceptional craftsmanship to a wider audience and celebrate their culture.

                        Our goal is to uplift all of our native communities together. Your purchase supports the preservation of our cultural heritage. Thank you!
                    </Typography>

                </div>

            </div>
        </>
    );
}