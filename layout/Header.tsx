import { Typography, useTheme, Tooltip, IconButton, Button, useMediaQuery, Badge, ButtonBase, TextField, Link } from "@mui/material";
import {
    ChevronRight,
    MenuOutlined,
    SearchOutlined,
    ShoppingBagOutlined
} from '@mui/icons-material';
import { useRouter } from "next/router";
import { UseCart } from "@/checkout/useCart";
import CoverImage from "@/components/CoverImage";
import TerandinaLogo from '@/public/Terandina_clear.png'
import TerandinaNoText from '@/public/Terandina_no_text.png'
import GarmentNoSleeve from '@/public/GarmentNoSleeve.png';
import GarmentAll from '@/public/GarmentAll.png';
import Image from "next/image";
import { useEffect, useState } from "react";
import anime from "animejs";
import MenuItem from "@/components/MenuItem";


const menuItems = [
    // {
    //     name: "Outerwear",
    //     value: "outerwear"
    // },
    {
        name: "Ponchos",
        value: "ponchos"
    },
    {
        name: "Cardigans",
        value: "cardigans"
    },
    {
        name: "Blankets",
        value: "blankets"
    },
    {
        name: "Jewelry",
        value: "jewelry"
    },
    {
        name: "Handcrafted",
        value: "handcrafted"
    },
    // {
    //     name: "Wholesale",
    //     value: "wholesale"
    // },
]


export default function Header({ Cart }: {
    Cart: UseCart
}) {

    const theme = useTheme();
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState('ponchos');

    const isSm = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        anime({
            targets: "#logo",
            opacity: [0, 1],
            duration: 100,
            easing: "easeInOutQuad",
            delay: 100,
        });

        anime({
            targets: ".menuButton",
            opacity: [0, 1],
            duration: 300,
            easing: "easeInOutQuad",
            delay: (el, i) => (100 * i) + 100,
        });
    }, [])

    const handleSwitchTab = (key: string) => {
        anime({
            targets: ".menuPanel",
            opacity: [1, 0],
            duration: 150,
            easing: "cubicBezier(.25, 1, .5, 1)",
            complete: (anim) => {
                console.log("Animation Complete!");
            }
        });

        setTimeout(() => {
            setActiveMenu(key);
        }, 300);

        setTimeout(() => {
            anime({
                targets: ".menuPanel",
                opacity: [0, 1],
                duration: 200,
                easing: "cubicBezier(.25, 1, .5, 1)",
                complete: (anim) => {
                    console.log("Animation Complete!");
                }
            });
        }, 350)



    }

    const handleCloseSidebar = () => {
        anime({
            targets: ".slide-in",
            translateX: ["0", "-150%"],
            duration: 750,
            delay: (el, i) => [0, 50, 150][i] || 0,
            easing: "cubicBezier(.25, 1, .5, 1)",
            complete: (anim) => {
                console.log("Animation Complete!");
            }
        });

        anime({
            targets: ".fade",
            opacity: [1, 0],
            duration: 300,
            easing: "cubicBezier(.25, 1, .5, 1)",
            complete: (anim) => {
                console.log("Animation Complete!");
            }
        });

        setTimeout(() => {
            setIsSidebarOpen(false);
        }, 750)
    }

    const handleOpenSidebar = () => {

        if (isSidebarOpen) {
            return;
        }
        setIsSidebarOpen(true);

        anime({
            targets: ".slide-in",
            translateX: ["-100%", "0%"],
            duration: 400,
            delay: (el, i) => [50, 0, 0][i] || 0,
            easing: "cubicBezier(.25, 1, .5, 1)",
            complete: (anim) => {
                console.log("Animation Complete!");
            }
        });

        anime({
            targets: ".fade",
            opacity: [0, 1],
            duration: 250,
            easing: "cubicBezier(.25, 1, .5, 1)",
            complete: (anim) => {
                console.log("Animation Complete!");
            }
        });

    }


    return (
        <>
            <div
                className="fade"
                onClick={() => handleCloseSidebar()}
                style={{
                    top: 0,
                    left: 0,
                    display: isSidebarOpen ? 'flex' : 'none',
                    width: "100vw",
                    height: "100vh",
                    backgroundColor: '#00000075',
                    zIndex: 2,
                    position: 'fixed',
                    opacity: 0,
                }}></div>
            <Image src={GarmentAll} alt="Garment"
                className="slide-in"
                onClick={() => handleCloseSidebar()}
                style={{
                    display: isSidebarOpen ? 'flex' : 'none',
                    position: "fixed",
                    // transform: "translateX(-115%)",
                    // top: "-10rem",
                    left: "5.5rem",
                    height: "100vh",
                    width: "auto",
                    zIndex: 3,
                }} />
            <Image src={GarmentNoSleeve} alt="Garment"
                className="slide-in"
                onClick={() => handleCloseSidebar()}
                style={{
                    display: isSidebarOpen ? 'flex' : 'none',
                    position: "fixed",
                    // transform: "translateX(-115%)",
                    // top: "-10rem",
                    left: "7.5rem",
                    height: "100vh",
                    width: "auto",
                    zIndex: 3
                }} />
            <div className="column top compact slide-in"
                style={{
                    display: isSidebarOpen ? 'flex' : 'none',
                    position: "fixed",
                    left: 0,
                    top: "5rem",
                    height: "calc(100vh - 5rem) ",
                    width: "25rem",
                    // backgroundImage: 'url(/GarmentAll.png)',
                    backgroundColor: '#efe6d6',
                    backgroundSize: 'cover',
                    backgroundPosition: "center",
                    // transform: "translateX(-115%)",
                    zIndex: 4,
                    maxWidth: "100vw"

                }}>

                <div className="column between" style={{
                    height: "100%"
                }}>

                    {activeMenu === 'blankets' && (
                        <div className="column fit menuPanel" style={{
                            opacity: 0
                        }}>
                            <ButtonBase
                                className="flex between middle"
                                disableRipple
                                key={'test'}
                                onClick={() => setIsSidebarOpen(prev => !prev)}
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
                                    }}>Explore Blankets</Typography>
                                </div>
                                <div className="flex fit">
                                    <ChevronRight sx={{
                                        opacity: 0.5
                                    }} />
                                </div>
                            </ButtonBase>
                            <div className="column fit" style={{
                                padding: "2rem"
                            }}>
                                <div className="column compact">

                                    <CoverImage url={'/pile.jpg'} width={"100%"} height={"22rem"} />
                                    {/* <Typography variant="caption">Skyriver Blue - Pishi Alpaca Poncho</Typography> */}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeMenu === 'jewelry' && (
                        <div className="column fit menuPanel" style={{
                            opacity: 0
                        }}>
                            <ButtonBase
                                className="flex between middle"
                                disableRipple
                                key={'test'}
                                onClick={() => setIsSidebarOpen(prev => !prev)}
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
                                    }}>Explore Jewelry</Typography>
                                </div>
                                <div className="flex fit">
                                    <ChevronRight sx={{
                                        opacity: 0.5
                                    }} />
                                </div>
                            </ButtonBase>

                        </div>
                    )}


                    {activeMenu === 'ponchos' && (
                        <div className="column fit menuPanel" style={{
                            opacity: 0
                        }}>
                            <ButtonBase
                                className="flex between middle"
                                disableRipple
                                key={'test'}
                                onClick={() => setIsSidebarOpen(prev => !prev)}
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
                                    }}>Explore Ponchos</Typography>
                                </div>
                                <div className="flex fit">
                                    <ChevronRight sx={{
                                        opacity: 0.5
                                    }} />
                                </div>
                            </ButtonBase>

                            <div className="column" style={{
                                padding: "2rem"
                            }}>
                                <div className="column compact">

                                    <CoverImage url={'/P1120417.jpg'} width={"100%"} height={"22rem"} />
                                    <Typography variant="caption">Skyriver Blue - Pishi Alpaca Poncho</Typography>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="column fit" style={{
                        padding: "1rem 0rem"
                    }}>
                        <div className="column snug">
                            <MenuItem
                                onClick={() => setIsSidebarOpen(false)}
                                icon={<ChevronRight sx={{
                                    opacity: 0.5
                                }} />}
                            >Our Values</MenuItem>

                            <MenuItem
                                onClick={() => setIsSidebarOpen(false)}
                                icon={<ChevronRight sx={{
                                    opacity: 0.5
                                }} />}
                            >Contact</MenuItem>
                        </div>

                        <div className="column" style={{
                            padding: "0 2rem"
                        }}>
                            <div className="flex snug" >
                                <TextField sx={{
                                    width: "calc(100% - 6rem)",
                                }}
                                    inputProps={{
                                        style: {
                                            fontWeight: 900,
                                            letterSpacing: '0.15px',
                                        },
                                    }}
                                />
                                <Button variant="contained" sx={{
                                    width: '6rem',
                                }}>Subscribe</Button>
                            </div>
                            <div className="flex between">

                                <Typography>Copyright Terandina 2025</Typography>
                                <Link href="/login">Login</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* <div style={{
                position: 'absolute',
                top: 0,
                width: "100%",
                height: "30rem",
                backgroundColor: "transparent",
                backdropFilter: "blur(100px)",
                maskImage: "linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.1) 100%)",
                WebkitMaskImage: "linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.1)"
            }}></div> */}
            <header
                className="column snug"
                style={{
                    position: 'fixed',
                    top: 0,
                    width: "100%",
                    backgroundColor: '#efe6d6',
                    height: isSm ? "5rem" : "5rem",
                    zIndex: 6

                }}

            >
                <div className="flex between middle"
                    style={{
                        padding: isSm ? "1rem" : "1.5rem 2rem",
                        backgroundColor: 'transparent',
                        color: theme.palette.getContrastText('#efe6d6'),
                        cursor: 'pointer',
                        height: '100%',
                        width: "100%"
                    }}
                >

                    {isSm && (
                        <div className="flex fit">
                            <IconButton onClick={() => {
                                isSidebarOpen ? handleCloseSidebar() : handleOpenSidebar()
                            }}>
                                <MenuOutlined />
                            </IconButton>
                        </div>
                    )}


                    <div className="flex fit" style={isSm ? {
                        position: 'absolute',
                        top: "0.5rem",
                        left: "50vw",
                        transform: 'translateX(-50%)'
                    } : {

                    }}>
                        <Image id="logo" src={TerandinaLogo} alt="Terandina"
                            onClick={() => router.push('/')}
                            style={{
                                width: "auto",
                                height: "4rem",
                                opacity: 0
                            }} />

                        {!isSm && (

                            <div className="flex">
                                {menuItems.map(item => {
                                    return (
                                        <ButtonBase
                                            disableRipple
                                            key={item.value}
                                            onClick={() => {
                                                !isSidebarOpen && setActiveMenu(item.value);
                                                handleSwitchTab(item.value)
                                                handleOpenSidebar();
                                            }}
                                            className="menuButton"
                                            sx={{
                                                display: 'inline',
                                                backgroundImage: `linear-gradient(#00000000, #00000000), linear-gradient(#000000, #000000)`,
                                                textDecoration: `none`,
                                                backgroundSize: `100% 0.1rem, 0 0.1rem`,
                                                backgroundPosition: `100% 2rem, 0 2rem`,
                                                backgroundRepeat: `no-repeat`,
                                                transition: `background-size .3s`,
                                                color: 'inherit',
                                                cursor: "pointer",
                                                whiteSpace: "pre-line",
                                                fontWeight: 800,
                                                textAlign: 'left',
                                                height: "3rem",
                                                '&:hover': {
                                                    backgroundSize: "0 0.1rem, 100% 0.1rem"
                                                },
                                                opacity: 0
                                            }}>
                                            <Typography variant="h6" sx={{
                                                textTransform: "uppercase",
                                                letterSpacing: "0.05rem",
                                                fontSize: "1rem"
                                            }}>{item.name}</Typography>
                                        </ButtonBase>
                                    )
                                })}

                            </div>
                        )}
                    </div>
                    <div className="flex fit">
                        {router.asPath === "/checkout" ? (
                            <Button variant="contained" onClick={() => router.push('/')}>Continue Shopping</Button>
                        ) : (
                            <div className="flex compact fit">
                                <IconButton onClick={() => {
                                    return;
                                }}>
                                    <SearchOutlined sx={{
                                        // color: theme.palette.primary.contrastText
                                    }} />
                                </IconButton>
                                <Badge
                                    badgeContent={Cart.cart?.length || 0}
                                    invisible={!Cart.cart || Cart.cart.length === 0}
                                    sx={{
                                        '& .MuiBadge-badge': {
                                            backgroundColor: theme.palette.primary.main,
                                            color: theme.palette.primary.contrastText
                                        }
                                    }}>
                                    <Tooltip title="My Cart">
                                        <IconButton onClick={() => Cart.toggleSidebar()}>
                                            <ShoppingBagOutlined sx={{
                                                // color: theme.palette.primary.contrastText
                                            }} />
                                        </IconButton>
                                    </Tooltip>
                                </Badge>
                            </div>
                        )}
                    </div>
                </div>
            </header>
        </>
    )
}