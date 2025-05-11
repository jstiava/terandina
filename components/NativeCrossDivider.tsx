import NativeCross from "@/icons/NativeCross";
import { Divider } from "@mui/material";

export default function NativeCrossDivider() {
    return (
        <div className="flex" style={{
            position: "relative",
            width: "100%",
            height: 'fit-content'
        }}>
            <Divider sx={{
                width: "100%"
            }} />
            <NativeCross
                fill={`#d6d6d6`}
                sx={{
                    position: "absolute",
                    left: "50%",
                    // top: "50%",
                    transform: "translate(-50%, 0.035rem)",
                    height: "1rem"
                }} />
        </div>
    )
}