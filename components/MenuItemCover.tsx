import { ButtonBase, Typography } from "@mui/material";
import { useState } from "react";


export default function MenuItemCover({ children, src, onClick }: any) {


    const [action, setAction] = useState<string | null>(null);
    return (
        <ButtonBase className="column compact"
            disableRipple
            onMouseEnter={() => setAction('hovering')}
            onMouseLeave={() => setAction(null)}
            onClick={onClick}
            sx={{
                width: "calc(50% - 0.5rem)",
                maxWidth: "12.5rem",
                height: "auto",
                marginBottom: "0.5rem"
            }}>
            <div style={{
                width: "100%",
                height: "auto",
                aspectRatio: "1/1",
                backgroundColor: "lightGrey",
                backgroundSize: action === 'hovering' ? '110%' : '100%',
                backgroundPosition: "center",
                backgroundImage: src ? `url(${src})` : '',
                transition: `background-size .3s`,
            }}></div>
            <Typography sx={{ textAlign: "center" }}>{children}</Typography>
        </ButtonBase>
    )
}