import theme from "@/styles/theme";
import { Button, Drawer, IconButton, Modal, Slide, TextField, Typography, useMediaQuery } from "@mui/material";
import CoverImage from "./CoverImage";
import { forwardRef } from "react";


const MobileSlideTransition = forwardRef(function Transition(
    props: any & { children: React.ReactElement },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});


export default function ContactDialog({ isOpen, onClose }: {
    isOpen: boolean,
    onClose: any
}) {

    const isSm = useMediaQuery(theme.breakpoints.down('sm'));

    const content = (
        <>
            <CoverImage
                height="auto"
                width="100%"
                style={{
                    aspectRatio: "1/ 0.6"
                }}
                url={'/cow.jpg'}
            />
            <div className="column" style={{
                padding: "2rem"
            }}>

                <Typography variant="h2">Contact Terandina</Typography>
                <TextField
                    variant="standard"
                    placeholder="Name"

                />
                <TextField
                    variant="standard"
                    placeholder="Email Address"

                />

                <TextField
                    variant="standard"
                    placeholder="Message"
                    multiline
                    maxRows={10}
                    minRows={3}
                />

                <Button variant="contained">Submit</Button>
            </div>
        </>
    )

    return (
        <>
            {isSm ? (
                <Drawer
                    key="isSm"
                    anchor="bottom"
                    onClose={onClose}
                    open={isOpen}
                // TransitionComponent={isSm ? MobileSlideTransition : undefined}
                >
                    {content}
                </Drawer>
            ) : (
                <Modal
                    key="notSm"
                    onClose={onClose}
                    open={isOpen}
                // TransitionComponent={isSm ? MobileSlideTransition : undefined}
                >
                    <div className="column" style={{
                        position: "absolute",
                        width: "100%",
                        maxWidth: isSm ? "100%" : '30rem',
                        height: "fit-content",
                        backgroundColor: theme.palette.background.paper,
                        top: isSm ? "unset" : "50vh",
                        bottom: isSm ? "0" : "unset",
                        left: isSm ? "0" : "50vw",
                        transform: isSm ? "unset" : 'translate(-50%, -50%)',
                        zIndex: 1000,
                        borderRadius: isSm ? "0.5rem 0.5rem 0 0" : '0.5rem',
                        overflow: 'hidden'
                    }}>

                        {content}
                    </div>
                </Modal>
            )}
        </>
    )
}