import { Typography } from "@mui/material";


export default function MenuItemCover({children} : any) {
    return (
        <div className="column compact" style={{
            width: "calc(50% - 0.5rem)",
            maxWidth: "10rem",
            height: "auto",
            marginBottom: "0.5rem"
        }}>
        <div style={{
            width: "100%",
            height: "auto",
            aspectRatio: "1/1",
            backgroundColor: "lightGrey"
        }}></div>
        <Typography sx={{ textAlign: "center" }}>{children}</Typography>
    </div>
    )
}