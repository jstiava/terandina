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
                        We are a Native-owned business committed to sharing the art and craftsmanship of Indigenous communities across the Americas—starting with our own. As proud members of the Quechua community in the Andes Mountains region of Ecuador, we come from a long line of artists and creatives. For generations, our people have expressed their identities, stories, and traditions through woven textiles. We aim to share the beauty and depth of this craftsmanship with the world.<br /><br />

                        We work closely with our fellow Quechua artisans in the highlands of Ecuador to bring their traditional designs to a wider audience. Each design holds strong significance as it is rooted in our Native heritage, reflective of our beliefs and the spirit of our people.<br /><br />

                        These textiles are woven from alpaca wool, a natural fiber that has been used by our people for generations. Historically, alpacas were bred by our ancestors for their soft fibers and temperature-regulating properties. This makes our products not only beautiful, but functional – providing warmth in the cold while being breathable in the heat.
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
                        In addition to our Andean textiles, we also collaborate with Native American artisans from Southwestern tribes such as the Navajo, Hopi, and Zuni to bring you authentic, handmade jewelry. These artisans are known for their intricate inlay techniques, which they use to create beautiful pieces that express their identity and connect them to their roots – principles we strongly resonate with as Indigenous peoples ourselves.<br /><br />

                        Our goal is to uplift Native communities—both in South America and here in the United States - by supporting artisans and creating a platform where their craftsmanship can be seen and valued. When you shop with us, you’re not only buying something beautiful - you’re supporting the preservation of our cultural heritage and helping ensure it continues for generations to come. Thank you.
                    </Typography>

                </div>

            </div>
        </>
    );
}