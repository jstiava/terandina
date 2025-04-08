import { CopyrightOutlined, EmailOutlined, HomeOutlined, ScheduleOutlined, StoreOutlined } from "@mui/icons-material";
import { Link, Typography, useMediaQuery, useTheme } from "@mui/material";
import TerandinaLogo from '@/public/Terandina_clear.png'
import TerandinaNoText from '@/public/Terandina_no_text.png'
import Image from "next/image";


export default function Footer({color} : {
    color: string
}) {

    const theme = useTheme();
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
            <div className={isSm ? "column relaxed center" : "flex between"}
                style={{
                    width: "100%"
                }}>

                <div className="flex compact fit">

                </div>
                
                <Image src={TerandinaLogo} alt="Terandina" style={isSm ?
                    {
                        position: 'relative',
                        transform: 'translate(0%, 0)',
                        width: "auto",
                        height: "8rem"
                    }
                : {
                    position: 'absolute',
                    bottom: "3.5rem",
                    transform: 'translate(-50%, 0)',
                    left: "50vw",
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