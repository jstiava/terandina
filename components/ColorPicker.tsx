import theme from "@/styles/theme";
import { PaletteOutlined } from "@mui/icons-material";
import { Tooltip, IconButton, Modal, TextField, Button } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import { HexColorPicker } from "react-colorful";

const hexColorRegex = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

export default function ColorPicker({ color, setColor } : {
    color: string,
    setColor: Dispatch<SetStateAction<string>>
}) {

    const [open, setOpen] = useState(false);
    const [colorText, setColorText] = useState(color)
    return (
        <>
            <Tooltip title="Color">
                <IconButton onClick={() => setOpen(true)} sx={{ width: "2.25rem", height: "2.25rem", borderRadius: "100vh", border: `2px solid ${theme.palette.getContrastText(color)}`, backgroundColor: color || "grey" }}>
                    <PaletteOutlined fontSize="small" sx={{
                        color: theme.palette.getContrastText(color)
                    }}/>
                </IconButton>
            </Tooltip>
            <Modal
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div
                    className="flex center middle"
                    style={{ width: "100%", height: "100%", }}
                    onClick={() => setOpen(false)}
                    >
                    <div className="column" style={{ backgroundColor: theme.palette.background.paper, padding: "1rem" }}>
                        <HexColorPicker color={colorText} onChange={(color) => {
                            if (hexColorRegex.test(color)) {
                                setColor(color);
                            }
                            setColorText(color)
                        }} />
                        <TextField name="theme_color" value={colorText} 
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                        onChange={(e) => {
                            e.stopPropagation();
                            if (hexColorRegex.test(e.target.value)) {
                                setColor(e.target.value);
                            }
                            setColorText(e.target.value)
                        }} />
                        <div className="flex compact">
                            <Button variant="contained" onClick={() => {
                                setOpen(false);
                            }}>Save</Button>
                            <Button onClick={() => setOpen(false)}>Close</Button>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    )
}