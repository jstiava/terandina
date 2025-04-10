import { ArrowForward, CopyrightOutlined, EmailOutlined, HomeOutlined, Instagram, ScheduleOutlined, StoreOutlined } from "@mui/icons-material";
import { ButtonBase, Link, Typography, useMediaQuery, useTheme } from "@mui/material";
import TerandinaLogo from '@/public/Terandina_clear.png'
import TerandinaNoText from '@/public/Terandina_no_text.png'
import Image from "next/image";
import { useRouter } from "next/router";
import MenuItem from "@/components/MenuItem";


export default function Footer({ color }: {
    color: string
}) {

    const theme = useTheme();
    const router = useRouter();
    const isSm = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <footer className={"flex middle"} style={{
            position: "relative",
            width: "100%",
            minHeight: "25vh",
            height: "fit-content",
            backgroundColor: color,
            color: theme.palette.getContrastText(color),
            padding: "3rem 5rem"
        }}>
            <div className={isSm ? "column center" : "flex between"}
                style={{
                    width: "100%",
                    flexDirection: isSm ? 'column-reverse' : 'row'
                }}>

                    <ButtonBase
                        className="flex compact left fit"
                        href="https://www.instagram.com/terandina.apparel/"
                    >
                        <Instagram fontSize="small" />
                        <Typography sx={{
                            textDecoration: 'underline'
                        }}>terandina.apparel</Typography>
                    </ButtonBase>

                <Image src={TerandinaLogo} alt="Terandina" style={isSm ?
                    {
                        position: 'relative',
                        transform: 'translate(0%, 0)',
                        width: "12rem",
                        height: "8rem"
                    }
                    : {
                        position: 'relative',
                        transform: 'translate(0%, 0)',
                        // position: 'absolute',
                        // bottom: "3.5rem",
                        // transform: 'translate(-50%, 0)',
                        // left: "50vw",
                        width: "auto",
                        height: "8rem"
                    }} />

                {/* <div className="column compact fit">

                    <div className="flex compact fit top">
                        <StoreOutlined fontSize="small" />
                        <Typography>3211 N. Cumberland Avenue<br />Chicago, IL, 23493</Typography>
                    </div>
                    <div className="flex compact fit top">
                        <ScheduleOutlined fontSize="small" />
                        <Typography>Mon-Thu: 8am-8pm, Fri: 8am-3pm</Typography>
                    </div>

                </div> */}
            </div>
        </footer>
    )
}