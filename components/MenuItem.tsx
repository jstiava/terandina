import theme from "@/styles/theme";
import { alpha, ButtonBase, ButtonBaseProps, ButtonBaseTypeMap, ExtendButtonBase, lighten, SxProps, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";


export default function MenuItem({ onClick, icon, reverse = false, children, sx = {}, focused = false, ...props }: {
    onClick: any,
    icon?: any,
    reverse?: boolean,
    children: any,
    focused?: boolean
} & ButtonBaseProps) {

    const theme = useTheme();
    const [action, setAction] = useState<string | null>(null);

    useEffect(() => {
        if (focused) {
            setTimeout(() => {
                setAction('hovering')
            }, 200)
        }
    }, [])

    return (
        <ButtonBase
            {...props}
            onMouseEnter={() => setAction('hovering')}
            onMouseLeave={() => setAction(null)}
            // onMouseDown={() => setAction('down')}
            className={`flex ${reverse ? 'right' : "between"} middle`}
            // disableRipple
            onClick={(e) => {
                setAction(null);
                onClick(e);
            }}
            sx={{
                height: "3.25rem",
                padding: "0 2rem",
                flexDirection: reverse ? 'row-reverse' : 'row',
                ...sx
            }}>
            <div className="flex fit" >
                <Typography variant="h6" sx={{
                    textTransform: "uppercase",
                    letterSpacing: "0.05rem",
                    fontSize: "1rem",
                    display: 'inline',
                    backgroundImage: `linear-gradient(#00000000, #00000000), linear-gradient(#000000, #000000)`,
                    textDecoration: `none`,
                    backgroundSize: action === 'hovering' ? "0 0.1rem, 100% 0.1rem" : `100% 0.1rem, 0 0.1rem`,
                    backgroundPosition: `100% 100%, 0 100%`,
                    backgroundRepeat: `no-repeat`,
                    transition: `background-size .3s`,
                    color: 'inherit',
                    cursor: "pointer",
                    whiteSpace: "pre-line",
                    fontWeight: 800,
                    textAlign: 'left',
                }}>{children}</Typography>
            </div>
            {icon ? (
                <div className="flex fit" style={{
                    opacity: reverse ? 1 : 0.25
                }}>
                    {icon}
                </div>
            ) : <div></div>}
        </ButtonBase>
    )
}