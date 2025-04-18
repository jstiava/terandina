import CoverImage from "@/components/CoverImage";
import { Typography, useMediaQuery, useTheme } from "@mui/material";
import Head from "next/head";


export default function OurValuesPage() {

    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down('sm'));

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
                    maxWidth: '50rem',
                    width: "100%",
                    padding: "4rem 2rem"
                }}>

                    <Typography variant="h1" sx={{
                        paddingBottom: "1rem"
                    }}>Our Values</Typography>

                    <CoverImage
                        height="auto"
                        width="100%"
                        url={`/cow.jpg`}
                        style={{
                            maxWidth: "45rem",
                            aspectRatio: " 1 / 0.7"
                        }}
                        caption={"Photo by Octavio Martinez"}
                        caption_link={"https://omtzphotos.darkroom.com/"}
                    />

                    <Typography variant="body1" sx={{
                        lineHeight: '2rem',
                        padding: isSm ? "0rem" : "2rem"
                    }}>
                        We are a Native-owned business committed to sharing the art, history, and craftsmanship of Indigenous communities across the Americas—starting with our own. As members of the Quechua community, our roots are in the Andes, and many of the textiles we offer come directly from the region we call home.<br /><br />


                        We work closely with our fellow Quechua artisans in the highlands of Ecuador to bring their traditional designs to the world. The clothing and blankets we offer are made from alpaca wool, a natural fiber that has been used in the Andes for generations. Alpaca was highly valued by the Inca civilization for its softness and temperature-regulating qualities—perfect for the diverse climates found in the high-altitude regions where alpacas are raised.
                    </Typography>

                    <CoverImage
                        height="auto"
                        width="100%"
                        url={`/waterfall.jpg`}
                        style={{
                            maxWidth: "45rem",
                             aspectRatio: " 1 / 0.7"
                        }}
                        caption={"Photo by Octavio Martinez"}
                        caption_link={"https://omtzphotos.darkroom.com/"}
                    />

                    <Typography variant="body1" sx={{
                        lineHeight: '2rem',
                        padding: isSm ? "0rem" : "2rem"
                    }}>
                        In addition to our Andean textiles, we also collaborate with Native American artisans from Southwestern tribes such as the Navajo, Hopi, and Zuni. These jewelry pieces are handmade and rooted in cultural traditions that are just as rich and meaningful.<br /><br />


                        Our goal is to uplift Native communities—both in South America and here in the United States—by supporting artisans, preserving cultural heritage, and creating a platform where their craftsmanship can be seen and valued. When you shop with us, you’re not only buying something beautiful—you’re supporting our cultural heritage and helping ensure they continue for generations to come.
                    </Typography>

                </div>

            </div>
        </>
    );
}