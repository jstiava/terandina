import { ButtonBase, Typography } from "@mui/material";


export default function MenuItem({ onClick, icon, children } : {
    onClick: any,
    icon: any,
    children: any
}) {

    return (
        <ButtonBase
            className="flex between middle"
            disableRipple
            onClick={onClick}
            sx={{
                height: "3rem",
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
            <div className="flex fit">
                {icon}
            </div>
        </ButtonBase>
    )
}