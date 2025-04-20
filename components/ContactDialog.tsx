import theme from "@/styles/theme";
import { Button, Drawer, IconButton, Modal, Slide, TextField, Typography, useMediaQuery } from "@mui/material";
import CoverImage from "./CoverImage";
import { ChangeEvent, forwardRef, useState } from "react";


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

    const [data, setData] = useState({
        name: "",
        email: "",
        message: ""
    })

    const handleChange = (eventOrName: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string, value: any) => {
        if (typeof eventOrName === "string") {
            setData((prev: any) => ({
                ...prev,
                [eventOrName]: value
            }));
            return;
        }
        if (!eventOrName.target.name) {
            return;
        }
        setData((prev: any) => ({
            ...prev,
            [eventOrName.target.name]: value
        }));
    }

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
                    value={data.name}
                    name="name"
                    onChange={e => handleChange(e, e.target.value)}

                />
                <TextField
                    variant="standard"
                    placeholder="Email Address"
                    value={data.email}
                    name="email"
                    onChange={e => handleChange(e, e.target.value)}

                />

                <TextField
                    variant="standard"
                    placeholder="Message"
                    multiline
                    maxRows={10}
                    minRows={3}
                    value={data.message}
                    name="message"
                    onChange={e => handleChange(e, e.target.value)}
                />

                <Button variant="contained"
                onClick={e => {
                    fetch('/api/subscribe', {
                        method: "POST",
                        headers: {
                            'Content-Type': "application/json"
                        },
                        body: JSON.stringify(data)
                    })
                    .then(res => {
                        onClose();
                    })
                }}
                >Submit</Button>
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