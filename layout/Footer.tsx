import { ArrowForward, CopyrightOutlined, EmailOutlined, HomeOutlined, Instagram, ScheduleOutlined, StoreOutlined } from "@mui/icons-material";
import { ButtonBase, Divider, IconButton, Link, TextField, Typography, useMediaQuery, useTheme } from "@mui/material";
import TerandinaLogo from '@/public/Terandina_clear.png'
import TerandinaNoText from '@/public/Terandina_no_text.png'
import Image from "next/image";
import { useRouter } from "next/router";
import MenuItem from "@/components/MenuItem";
import { menuItems } from "./Header";
import TerandinaWordmark from "@/icons/TerandinaWordmark";


export default function Footer({ color }: {
    color: string
}) {

    const theme = useTheme();
    const router = useRouter();
    const isSm = useMediaQuery(theme.breakpoints.down('sm'));
    const isMd = useMediaQuery(theme.breakpoints.down('md'));

    const leftWidth = "25rem";

    return (
        <footer className={"column middle relaxed"} style={{
            width: "100%",
            minHeight: "25vh",
            height: "fit-content",
            backgroundColor: color,
            color: theme.palette.getContrastText(color),
            padding: isSm ? "2rem" : "3rem 5rem"
        }}>
            <div className={isSm ? "column" : "flex relaxed top"} style={{
                padding: "3rem 0"
            }}>
                <div className="column fit" style={{
                    width: isSm ? "100%" : leftWidth
                }}>
                    <div className="column snug">
                        <Typography variant="h6" sx={{
                            textTransform: 'uppercase',
                            fontSize: "1rem"
                        }}>Subscribe to our Newsletter</Typography>
                        <TextField
                            variant="standard"
                            placeholder="Email Address"
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <IconButton>
                                            <ArrowForward sx={{
                                                fontSize: '1.25rem'
                                            }} />
                                        </IconButton>
                                    )
                                }
                            }}
                        />
                    </div>
                    <div className="flex compact">
                        <IconButton
                            href="https://www.instagram.com/terandina.apparel/"
                            onClick={e => {
                                e.preventDefault();
                                e.stopPropagation();
                                window.open('https://www.instagram.com/terandina.apparel/', '_blank')
                            }}
                        >
                            <Instagram fontSize="small" />
                        </IconButton>
                    </div>
                </div>
                <div className={isSm ? "column relaxed top" : "flex relaxed top"} style={{
                    width: isSm ? "100%" : "calc(100% - 30rem)"
                }}>
                    <div className="column compact fit" style={{
                        width: isSm ? "100%" : "clamp(10rem, 100%, 15rem)",
                    }}>
                        {/* <Typography variant="h6" sx={{
                            textTransform: 'uppercase',
                            fontSize: "1rem"
                        }}>About Us</Typography> */}
                        {ABOUT_US.map(item => (
                            <ButtonBase
                                key={item.value}
                                className="flex between"
                                href={`/${item.value}`}
                            >
                                <Typography>{item.name}</Typography>
                                <ArrowForward sx={{
                                    fontSize: '1rem'
                                }} />
                            </ButtonBase>
                        ))}
                    </div>
                </div>
                {!isMd && (
                    <div className="column compact fit" style={{
                        width: isSm ? "100%" : "clamp(10rem, 100%, 15rem)",
                    }}>
                        <TerandinaWordmark
                            style={{
                                width: "100%",
                                height: "auto"
                            }}
                            fill={"#3d3d3d"}
                        />
                    </div>
                )}
            </div>
            <Divider></Divider>
            <div className="flex between">
                <Typography>Terandina Inc. Copyright 2025.</Typography>
                <Typography></Typography>
            </div>
        </footer>
    )
}


const OUTERWEAR = [
    {
        name: "Ponchos",
        value: 'ponchos'
    },
    {
        name: "Cardigans",
        value: 'cardigans'
    },
    {
        name: "Hoodies",
        value: 'hoodies'
    }
]


const ACCESSORIES = [
    {
        name: "Blankets",
        value: 'blankets'
    },
    {
        name: "Jewelry",
        value: 'jewelry'
    },
    {
        name: "Handcrafted",
        value: 'handcrafted'
    }
]

export const ABOUT_US = [
    {
        name: "About",
        value: 'our-values'
    },
    {
        name: "Contact",
        value: 'contact'
    },
    {
        name: "Return Policy",
        value: 'returns'
    },
    {
        name: "FAQs",
        value: 'faqs'
    }
]


export const ABOUT_US_SIDEBAR = [
    {
        name: "About",
        value: 'our-values'
    },
    {
        name: "Contact",
        value: 'contact'
    },
]
