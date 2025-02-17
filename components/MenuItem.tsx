import theme from "@/styles/theme";
import { alpha, ButtonBase, lighten, Typography, useTheme } from "@mui/material";
import { useState } from "react";


export default function MenuItem({ onClick, icon, children }: {
    onClick: any,
    icon?: any,
    children: any
}) {

    const theme = useTheme();
    const [action, setAction] = useState<string | null>(null);

    const hovering = alpha(theme.palette.primary.main, 0.025);
    const down = alpha(theme.palette.primary.main, 0.05);
    return (
        <ButtonBase
            // onMouseEnter={() => setAction('hovering')}
            // onMouseLeave={() => setAction(null)}
            // onMouseDown={() => setAction('down')}
            className="flex between middle"
            // disableRipple
            onClick={(e) => {
                setAction(null);
                onClick(e);
            }}
            sx={{
                height: "3.25rem",
                padding: "0 2rem",
            }}>
            <div className="flex fit">
                <Typography variant="h6" sx={{
                    textTransform: "uppercase",
                    letterSpacing: "0.05rem",
                    fontSize: "1rem",
                    display: 'inline',
                    backgroundImage: `linear-gradient(#00000000, #00000000), linear-gradient(#000000, #000000)`,
                    textDecoration: `none`,
                    backgroundSize: `100% 0.1rem, 0 0.1rem`,
                    backgroundPosition: `100% 100%, 0 100%`,
                    backgroundRepeat: `no-repeat`,
                    transition: `background-size .3s`,
                    color: 'inherit',
                    cursor: "pointer",
                    whiteSpace: "pre-line",
                    fontWeight: 800,
                    textAlign: 'left',
                    '&:hover': {
                        backgroundSize: "0 0.1rem, 100% 0.1rem"
                    }
                }}>{children}</Typography>
            </div>
            {icon ? (
                <div className="flex fit" style={{
                    opacity: 0.25
                }}>
                    {icon}
                </div>
            ) : <div></div>}
        </ButtonBase>
    )
}