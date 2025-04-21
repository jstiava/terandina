import NativeCrossDivider from "@/components/NativeCrossDivider";
import { Divider, Link, Typography } from "@mui/material";
import Head from "next/head";



const FAQs = [
    {
        question: "Where are your products made?",
        answer: "Our ponchos, cardigans, hoodies, and blankets are made by indigenous artisans (Quechua) from Ecuador in the Andes Mountain region. We proudly work with small, native-owned workshops, aiming to share their art and creative expression with the world.\n\nOur jewelry is handmade by authentic Native American artists from the Southwest. We source jewelry primarily from New Mexico and Arizona."
    },
    {
        question: "Are your alpaca products made from 100% alpaca wool?",
        answer: "Our alpaca ponchos, cardigans, and blankets are thoughtfully made from a premium blend of natural alpaca wool and acrylic fibers. This combination adds durability and makes our products easier to care for. Each item remains soft, warm, and long-lasting, while also being conveniently machine washable and resistant to losing its shape.\n\nWe always prioritize a higher content of alpaca than synthetic materials, so you can enjoy the natural feel and warmth of alpaca with added practicality."
    },
    {
        question: "Are your jewelry pieces truly authentic Native American?",
        answer: "Our collection features jewelry handcrafted by true Native American artisans—primarily from Southwestern tribes such as the Navajo, Hopi, and Zuni. We also carry a selection of pieces that are not stamped, so we cannot guarantee their tribal origin. Pieces that are signed by Native artisans will be clearly reflected in each product page.\n\nWhile not all items are artist-stamped, each piece is made with genuine stones and high-quality sterling silver (.925). We take great care in curating designs that honor tradition, craftsmanship, and authenticity wherever possible."
    },
    {
        question: "How should I care for my alpaca-blend and wool products?",
        answer: "In order to increase longevity, we recommend machine washing in cold water with mild detergent and laying flat to dry. Avoid wringing or twisting as this can damage the fibers. Keep away from direct sunlight and dry your garments in the shade to preserve original colors.\n\nFor alpaca-blends, if ironing is needed, use a low heat setting and place a cloth between the iron and the garment to avoid direct contact. Steam can also help release wrinkles gently — just be sure not to overheat the fabric."
    },
    {
        question: "Are your products sustainable?",
        answer: "We strive to continually improve our sustainability efforts. We prioritize natural fibers such as alpaca and lamb’s wool for their exceptional quality and lower environmental impact. Additionally, we source our products in small batches to reduce overproduction and minimize waste."
    },

]


export default function OurValuesPage() {


    return (
        <>
            <Head>
                <title>FAQs - Terandina - Handcrafted Native Outerwear and Accessories</title>
            </Head>
            <div className="column center"
                style={{
                    width: "100%",
                    padding: "0",
                    marginTop: "4rem"
                }}>

                <div className="column relaxed center" style={{
                    maxWidth: "45rem",
                    width: "100%",
                    padding: "4rem 2rem"
                }}>

                    <Typography variant="h1">FAQs</Typography>

                    <div className="column relaxed" style={{
                        marginTop: "1rem"
                    }}>
                        {FAQs.map((faq, index) => (
                            <div className="column compact" key={index}>
                                <Typography variant="h6" sx={{
                                    lineHeight: "115%"
                                }}>{faq.question}</Typography>
                                <Typography sx={{
                                    whiteSpace: 'pre-wrap',
                                    lineHeight: "150%",
                                    textAlign: 'justify'
                                }}>{faq.answer}</Typography>
                                <div style={{marginTop: "1rem"}}><NativeCrossDivider /></div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </>
    );
}