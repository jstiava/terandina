import { Typography, useTheme, Tooltip, IconButton, Button, useMediaQuery, Badge, ButtonBase, TextField, Link, alpha } from "@mui/material";
import {
    ArrowForward,
    ChevronLeft,
    ChevronRight,
    CloseOutlined,
    EditOutlined,
    EmailOutlined,
    MenuOutlined,
    PhoneOutlined,
    SearchOutlined,
    ShoppingBagOutlined
} from '@mui/icons-material';
import { useRouter } from "next/router";
import { UseCart } from "@/checkout/useCart";
import CoverImage from "@/components/CoverImage";
import TerandinaLogo from '@/public/Terandina_clear.png'
import TerandinaWhite from '@/public/Terandina_white.png'
import TerandinaNoText from '@/public/Terandina_no_text.png'
import GarmentNoSleeve from '@/public/GarmentNoSleeve.png';
import GarmentAll from '@/public/GarmentAll.png';
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import anime from "animejs";
import MenuItem from "@/components/MenuItem";
import ColorPicker from "@/components/ColorPicker";
import { headerHeight } from "./AuthProvider";
import ScrollButton from "@/components/ScrollButton";


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
        name: "Outerwear",
        value: "outerwear"
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


export default function Header({ Cart, color, setColor }: {
    Cart: UseCart,
    color: string,
    setColor: Dispatch<SetStateAction<string>>
}) {

    const theme = useTheme();
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState('placeholder');

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
    }, [isSm])

    const handleSwitchTab = (key: string) => {

        if (key === activeMenu) {
            return;
        }

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

        if (!isSidebarOpen) {
            return;
        }

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
                    top: headerHeight,
                    height: `calc(100vh - ${headerHeight}) `,
                    width: isSm ? "100%" : "25rem",
                    // backgroundImage: 'url(/GarmentAll.png)',
                    backgroundColor: color,
                    backgroundSize: 'cover',
                    backgroundPosition: "center",
                    // transform: "translateX(-115%)",
                    zIndex: 4,
                    maxWidth: "100vw"

                }}>

                <div className="column between" style={{
                    height: "100%"
                }}>

                    <div className="column fit snug" style={{
                        maxHeight: "calc(100% - 6rem)",
                        height: "fit-content",
                        overflowY: "scroll",
                        marginBottom: 0,
                        paddingTop: isSm && activeMenu != 'menu' ? "3rem" : 0
                    }}>


                        {activeMenu === 'menu' ? (
                            <div className="column fit snug menuPanel" style={{
                                opacity: 0
                            }}>
                                {menuItems.map(item => (
                                    <MenuItem
                                        key={item.value}
                                        onClick={() => handleSwitchTab(item.value)}
                                        icon={<ChevronRight fontSize="small"/>}
                                    >
                                        {item.value}
                                    </MenuItem>
                                ))}
                            </div>
                        ) : (
                            <>
                                {isSm ? (
                                    <>
                                        <ButtonBase
                                            className="flex between middle"
                                            disableRipple
                                            key={'menu_back_button'}
                                            onClick={() => handleSwitchTab('menu')}
                                            sx={{
                                                height: "3rem",
                                                padding: "0 1.5rem",
                                                position: "fixed",
                                                top: 0,
                                                zIndex: 8,
                                                backgroundColor: color
                                            }}>
                                            <div className="flex compact fit" >
                                                <div className="flex fit">
                                                    <ChevronLeft sx={{
                                                        opacity: 0.5,
                                                        marginTop: "-0.1rem"
                                                    }} />
                                                </div>
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
                                                }}>Back</Typography>
                                            </div>

                                        </ButtonBase>
                                    </>
                                ) : (
                                    <></>
                                )}
                            </>
                        )}

                        {activeMenu === 'blankets' && (
                            <div className="column fit menuPanel" style={{
                                opacity: 0
                            }}>

                                <MenuItem
                                    key={'blankets'}
                                    onClick={() => router.push('outerwear')}
                                    icon={<ArrowForward fontSize="small" />}
                                >Explore All Blankets</MenuItem>


                                <div className="column fit" style={{
                                    padding: "0 2rem"
                                }}>
                                    <div className="column compact">

                                        <CoverImage url={'/pile.jpg'} width={"100%"} height={"22rem"} />
                                        {/* <Typography variant="caption">Skyriver Blue - Pishi Alpaca Poncho</Typography> */}
                                    </div>
                                </div>
                            </div>
                        )}


                        {activeMenu === 'outerwear' && (
                            <div className="column fit menuPanel" style={{
                                opacity: 0
                            }}>
                                <MenuItem
                                    key={'all outerwear'}
                                    onClick={() => router.push('outerwear')}
                                    icon={<ArrowForward fontSize="small" />}
                                >Explore All Outerwear</MenuItem>

                                <div className="flex" style={{
                                    padding: "0 2rem"
                                }}>
                                    <div className="column compact" style={{
                                        width: "calc(50% - 0.5rem)",
                                        maxWidth: "10rem"
                                    }}>
                                        <div style={{
                                            width: "100%",
                                            height: "10rem",
                                            backgroundColor: "lightGrey"
                                        }}></div>
                                        <Typography sx={{ textAlign: "center" }}>Men's</Typography>
                                    </div>
                                    <div className="column compact" style={{
                                        width: "calc(50% - 0.5rem)",
                                        maxWidth: "10rem"
                                    }}>
                                        <div style={{
                                            width: "100%",
                                            height: "10rem",
                                            backgroundColor: "lightGrey"
                                        }}></div>
                                        <Typography sx={{ textAlign: "center" }}>Women's</Typography>
                                    </div>
                                </div>
                                <div className="column snug fit">
                                    <MenuItem
                                        key={'cardigans'}
                                        onClick={() => router.push('outerwear')}
                                        icon={<ArrowForward fontSize="small" />}
                                    >Cardigans</MenuItem>

                                    <MenuItem
                                        key={'hoodies'}
                                        onClick={() => router.push('outerwear')}
                                        icon={<ArrowForward fontSize="small" />}
                                    >Hoodies</MenuItem>

                                </div>
                            </div>
                        )}


                        {activeMenu === 'jewelry' && (
                            <div className="column fit menuPanel" style={{
                                opacity: 0
                            }}>
                                <MenuItem
                                    key={'jewelry'}
                                    onClick={() => router.push('outerwear')}
                                    icon={<ArrowForward fontSize="small" />}
                                >Explore All Jewelry</MenuItem>
                                <div className="flex between" style={{
                                    padding: "0 2rem"
                                }}>
                                    <div className="column compact">
                                        <div style={{
                                            width: "10rem",
                                            height: "10rem",
                                            backgroundColor: "lightGrey"
                                        }}></div>
                                        <Typography sx={{ textAlign: "center" }}>Men's</Typography>
                                    </div>
                                    <div className="column compact">
                                        <div style={{
                                            width: "10rem",
                                            height: "10rem",
                                            backgroundColor: "lightGrey"
                                        }}></div>
                                        <Typography sx={{ textAlign: "center" }}>Women's</Typography>
                                    </div>
                                </div>


                            </div>
                        )}


                        {activeMenu === 'handcrafted' && (
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
                                        }}>Explore All Handcrafted Items</Typography>
                                    </div>
                                    <div className="flex fit">
                                        <ChevronRight sx={{
                                            opacity: 0.5
                                        }} />
                                    </div>
                                </ButtonBase>


                                <div className="flex" style={{
                                    padding: "0 2rem",
                                    flexWrap: 'wrap'
                                }}>
                                    <div className="column compact" style={{
                                        width: "calc(50% - 1rem)",
                                        maxWidth: "10rem",
                                        marginBottom: "0.5rem"
                                    }}>
                                        <div style={{
                                            width: "100%",
                                            height: "10rem",
                                            backgroundColor: "lightGrey"
                                        }}></div>
                                        <Typography sx={{ textAlign: "center" }}>Bowls</Typography>
                                    </div>
                                    <div className="column compact" style={{
                                        width: "calc(50% - 1rem)",
                                        maxWidth: "10rem",
                                        marginBottom: "0.5rem"
                                    }}>
                                        <div style={{
                                            width: "100%",
                                            height: "10rem",
                                            backgroundColor: "lightGrey"
                                        }}></div>
                                        <Typography sx={{ textAlign: "center" }}>Textiles</Typography>
                                    </div>
                                    <div className="column compact" style={{
                                        width: "calc(50% - 1rem)",
                                        maxWidth: "10rem",
                                        marginBottom: "0.5rem"
                                    }}>
                                        <div style={{
                                            width: "100%",
                                            height: "10rem",
                                            backgroundColor: "lightGrey"
                                        }}></div>
                                        <Typography sx={{ textAlign: "center" }}>Paintings</Typography>
                                    </div>
                                    <div className="column compact" style={{
                                        width: "calc(50% - 1rem)",
                                        maxWidth: "10rem",
                                        marginBottom: "0.5rem"
                                    }}>
                                        <div style={{
                                            width: "100%",
                                            height: "10rem",
                                            backgroundColor: "lightGrey"
                                        }}></div>
                                        <Typography sx={{ textAlign: "center" }}>Tools</Typography>
                                    </div>
                                    <div className="column compact" style={{
                                        width: "calc(50% - 1rem)",
                                        maxWidth: "10rem",
                                        marginBottom: "0.5rem"
                                    }}>
                                        <div style={{
                                            width: "100%",
                                            height: "10rem",
                                            backgroundColor: "lightGrey"
                                        }}></div>
                                        <Typography sx={{ textAlign: "center" }}>Spirtual</Typography>
                                    </div>
                                </div>


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
                                    onClick={() => {
                                        setIsSidebarOpen(prev => !prev);
                                        router.push('/ponchos');
                                    }}
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
                                        }}>Explore All Ponchos</Typography>
                                    </div>
                                    <div className="flex fit">
                                        <ChevronRight sx={{
                                            opacity: 0.5
                                        }} />
                                    </div>
                                </ButtonBase>

                                <div className="column" style={{
                                    padding: "0 2rem"
                                }}>
                                    <div className="column compact">

                                        <CoverImage url={'/P1120417.jpg'} width={"100%"} height={"22rem"} />
                                        <Typography variant="caption">Skyriver Blue - Pishi Alpaca Poncho</Typography>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>

                    <div className="column fit" style={{
                        padding: "1rem 0rem",
                        // position: 'absolute',
                        bottom: 0,
                        backgroundColor: color
                    }}>
                        <div className="column snug">
                            <MenuItem
                                onClick={() => setIsSidebarOpen(false)}
                                icon={<ArrowForward fontSize="small" />}
                            >Our Values</MenuItem>

                            <MenuItem
                                onClick={() => setIsSidebarOpen(false)}
                                icon={<EmailOutlined fontSize="small" />}
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

            {isSidebarOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    width: "100vw",
                    height: headerHeight,
                    backgroundColor: color,
                    zIndex: 5
                }}></div>
            )}
            <header
                className="column snug"
                style={{
                    position: 'fixed',
                    top: 0,
                    width: "100%",
                    backgroundColor: alpha(color, 0.9),
                    color: theme.palette.getContrastText(color),
                    height: isSm ? headerHeight : headerHeight,
                    zIndex: 6

                }}

            >
                <div className="flex between middle"
                    style={{
                        padding: isSm ? "1rem" : "1.5rem 2rem",
                        backgroundColor: 'transparent',
                        color: theme.palette.getContrastText(color),
                        cursor: 'pointer',
                        height: '100%',
                        width: "100%"
                    }}
                >

                    {isSm && (
                        <div className="flex fit">
                            <IconButton onClick={() => {
                                handleSwitchTab('menu')
                                isSidebarOpen ? handleCloseSidebar() : handleOpenSidebar()
                            }}>
                                {isSidebarOpen ? <CloseOutlined /> : <MenuOutlined />}
                            </IconButton>
                        </div>
                    )}


                    <div className="flex fit" style={isSm ? {
                        position: 'absolute',
                        top: isSm ? "0rem" : "0.5rem",
                        left: "50vw",
                        transform: 'translateX(-50%)'
                    } : {

                    }}>
                        {theme.palette.getContrastText(color) === '#fff' ? (
                            <Image id="logo" src={TerandinaWhite} alt="Terandina"
                                onClick={() => router.push('/')}
                                style={{
                                    width: "auto",
                                    height: "4rem",
                                    opacity: 0
                                }} />
                        ) : (
                            <Image id="logo" src={TerandinaLogo} alt="Terandina"
                                onClick={() => router.push('/')}
                                style={{
                                    width: "auto",
                                    height: "4rem",
                                    opacity: 0
                                }} />
                        )}

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
                                                    backgroundSize: "0 0.1rem, 100% 0.1rem",
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

                                <>
                                    {router.pathname && router.pathname.startsWith('/admin') && (
                                        <Button
                                            key="edit"
                                            onClick={e => {
                                                e.stopPropagation();
                                                router.push('/admin/categories')
                                            }}
                                            variant="outlined"
                                            startIcon={
                                                <EditOutlined fontSize="small" />
                                            }
                                            sx={{
                                                height: "2rem"
                                            }}
                                        >
                                            Edit
                                        </Button>
                                    )}
                                </>

                            </div>
                        )}
                    </div>
                    <div className="flex fit">
                        {router.asPath === "/checkout" ? (
                            <Button variant="contained" onClick={() => router.push('/')}>Continue Shopping</Button>
                        ) : (
                            <div className="flex snug fit">
                                {/* <ColorPicker color={color} setColor={setColor} /> */}

                                <div className="flex compact fit">
                                    {/* <IconButton onClick={() => {
                                        return;
                                    }}>
                                        <SearchOutlined sx={{
                                            color: theme.palette.getContrastText(color)
                                        }} />
                                    </IconButton> */}
                                    <Badge
                                        badgeContent={Cart.cart?.length || 0}
                                        invisible={!Cart.cart || Cart.cart.length === 0}
                                        sx={{
                                            '& .MuiBadge-badge': {
                                                backgroundColor: color,
                                                color: theme.palette.getContrastText(color)
                                            }
                                        }}>
                                        <Tooltip title="My Cart">
                                            <IconButton onClick={() => Cart.toggleSidebar()}>
                                                <ShoppingBagOutlined sx={{
                                                    color: theme.palette.getContrastText(color)
                                                }} />
                                            </IconButton>
                                        </Tooltip>
                                    </Badge>
                                </div>
                                {/* <ScrollButton variant="contained" onClick={() => router.push('/products')} sx={{
                                    height: "2.5rem",
                                    marginLeft: "1rem"
                                }}>Shop All</ScrollButton> */}
                            </div>
                        )}
                    </div>
                </div>
            </header>
        </>
    )
}