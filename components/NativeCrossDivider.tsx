import NativeCross from "@/icons/NativeCross";
import { Divider } from "@mui/material";

export default function NativeCrossDivider() {
    return (
        <div className="flex" style={{
            position: "relative",
            height: 'fit-content',
            width: "100%",
        }}>
            <Divider sx={{
                width: "100%"
            }} />
            <NativeCross
                fill={`#d6d6d6`}
                sx={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -0.675rem)"
                }} />
        </div>
    )
}