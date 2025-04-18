import { Typography, useTheme, Tooltip, IconButton, Button, useMediaQuery, Badge, ButtonBase, TextField, Link, alpha } from "@mui/material";
import {
    ArrowBack,
    ArrowForward,
    ArrowLeftOutlined,
    ChevronLeft,
    ChevronRight,
    CloseOutlined,
    EditOutlined,
    EmailOutlined,
    Instagram,
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
import MenuItemCover from "@/components/MenuItemCover";
import { ABOUT_US, ABOUT_US_SIDEBAR } from "./Footer";
import TerandinaWordmark from "@/icons/TerandinaWordmark";


export const menuItems = [
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
        name: "Accessories",
        value: "accessories"
    }
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

    const pleasePush: (...args: Parameters<typeof router.push>) => void = (
        ...args
    ) => {
        setIsSidebarOpen(false);
        router.push(...args);
    };

    const isSm = useMediaQuery(theme.breakpoints.down('sm'));
    // const isVerySmall = useMediaQuery("(max-width: 25rem)")
    const isVerySmall = false;


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

        if (key === 'menu') {
            setActiveMenu(key);
        }
        else {
            setTimeout(() => {
                setActiveMenu(key);
            }, 300);
        }

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
                    height: "100dvh",
                    backgroundColor: '#00000075',
                    zIndex: 2,
                    position: 'fixed',
                    opacity: 0,
                }}></div>
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
                    zIndex: 6,
                    maxWidth: "100vw"

                }}>

                <div className="column between" style={{
                    height: "calc(100% - 13.5rem)"
                }}>

                    <div className="column fit snug" style={{
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
                                        icon={<ChevronRight fontSize="small" />}
                                    >
                                        {item.value}
                                    </MenuItem>
                                ))}
                            </div>
                        ) : (
                            <>
                                {isSm ? (
                                    <>
                                        <MenuItem
                                            key={'back'}
                                            disableRipple
                                            onClick={() => handleSwitchTab('menu')}
                                            reverse
                                            icon={<ChevronLeft sx={{
                                                marginTop: "-0.1rem !important"
                                            }} />}
                                            sx={{
                                                height: "3rem",
                                                padding: "0 1.5rem",
                                                position: "fixed",
                                                top: 0,
                                                zIndex: 8,
                                                backgroundColor: color
                                            }}
                                        >Back</MenuItem>
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
                                    focused
                                    key={'blankets'}
                                    onClick={() => pleasePush('/blankets')}
                                    icon={<ArrowForward fontSize="small" />}
                                >Explore All Blankets</MenuItem>

                                <div className="column" style={{
                                    padding: "0 2rem"
                                }}>
                                    <ButtonBase href={`/item/prod_RmSkpjLIPNAj7e`} className="column compact2 left">
                                        <CoverImage url={'/blanket_example.jpg'} width={"100%"} height={"22rem"} />
                                        <Typography variant="caption">Sky Blue - Alpaca Blanket</Typography>
                                    </ButtonBase>
                                </div>


                            </div>
                        )}


                        {activeMenu === 'outerwear' && (
                            <div className="column fit menuPanel" style={{
                                opacity: 0
                            }}>
                                <MenuItem
                                    focused
                                    key={'all outerwear'}
                                    onClick={() => pleasePush('/outerwear')}
                                    icon={<ArrowForward fontSize="small" />}
                                >Explore All Outerwear</MenuItem>

                                {/* <div className="flex" style={{
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
                                </div> */}


                                <div className={isVerySmall ? "column compact" : "flex compact top"} style={{
                                    padding: "0 1.5rem 0 2rem",
                                    flexWrap: 'wrap'
                                }}>
                                    <MenuItemCover
                                        src={'/cardigan_example.webp'}
                                        onClick={() => {
                                            pleasePush(`/cardigans`)
                                        }}
                                    ><Typography sx={{ textAlign: "center" }}>Cardigans</Typography></MenuItemCover>
                                    <MenuItemCover
                                        src={'/hoodie_example.webp'}
                                        onClick={() => {
                                            pleasePush(`/hoodies`)
                                        }}
                                    ><Typography sx={{ textAlign: "center" }}>Hoodies</Typography></MenuItemCover>

                                </div>
                            </div>
                        )}


                        {activeMenu === 'jewelry' && (
                            <div className="column fit menuPanel" style={{
                                opacity: 0
                            }}>
                                <MenuItem
                                    focused
                                    key={'jewelry'}
                                    onClick={() => pleasePush('/jewelry')}
                                    icon={<ArrowForward fontSize="small" />}
                                >Explore All Jewelry</MenuItem>

                                <div className={isVerySmall ? "column compact" : "flex compact top"} style={{
                                    padding: "0 1.5rem 0 2rem",
                                    flexWrap: 'wrap'
                                }}>
                                    <MenuItemCover
                                        src={'/ring_example.webp'}
                                        onClick={() => {
                                            pleasePush(`/rings`)
                                        }}
                                    ><Typography sx={{ textAlign: "center" }}>Rings</Typography></MenuItemCover>
                                    <MenuItemCover
                                        src={'/pendant_example.webp'}
                                        onClick={() => {
                                            pleasePush(`/pendants`)
                                        }}
                                    ><Typography sx={{ textAlign: "center" }}>Pendants</Typography></MenuItemCover>
                                    <MenuItemCover
                                        src={'/cuff_example.webp'}
                                        onClick={() => {
                                            pleasePush(`/cuffs`)
                                        }}
                                    ><Typography sx={{ textAlign: "center" }}>Cuffs</Typography></MenuItemCover>
                                </div>
                                {/* <div className={isVerySmall ? "column compact" : "flex compact top"} style={{
                                    padding: "0 2rem"
                                }}>
                                    <MenuItemCover><Typography sx={{ textAlign: "center" }}>Men's</Typography></MenuItemCover>
                                    <MenuItemCover><Typography sx={{ textAlign: "center" }}>Women's</Typography></MenuItemCover>
                                </div> */}


                            </div>
                        )}


                        {activeMenu === 'accessories' && (
                            <div className="column fit menuPanel" style={{
                                opacity: 0
                            }}>

                                <MenuItem
                                    focused
                                    key={'accessories'}
                                    onClick={() => pleasePush('/accessories')}
                                    icon={<ArrowForward fontSize="small" />}
                                >Explore All Accessories</MenuItem>

                                <div className="column" style={{
                                    padding: "0 2rem"
                                }}>
                                    <ButtonBase href={`/item/prod_RopvBBF8ycpwyF`} className="column compact2 left">

                                        <CoverImage url={'/AmethystTree2.jpg'} width={"100%"} height={"22rem"} />
                                        <Typography variant="caption">Amethyst Natural Healing Tree</Typography>
                                    </ButtonBase>
                                </div>

                            </div>
                        )}


                        {activeMenu === 'ponchos' && (
                            <div className="column fit menuPanel" style={{
                                opacity: 0
                            }}>
                                <MenuItem
                                    focused
                                    key={'ponchos'}
                                    onClick={() => pleasePush('/ponchos')}
                                    icon={<ArrowForward fontSize="small" />}
                                >Explore All Ponchos</MenuItem>

                                <div className="column" style={{
                                    padding: "0 2rem"
                                }}>
                                    <ButtonBase href={`/item/prod_RigTRdFfzArr0Q`} className="column compact2 left">

                                        <CoverImage url={'/P1120417.jpg'} width={"100%"} height={"22rem"} />
                                        <Typography variant="caption">Sacred Smoke - Heavy Wool Poncho</Typography>
                                    </ButtonBase>
                                </div>
                            </div>
                        )}

                    </div>

                    <div className="column fit" style={{
                        padding: "2rem 0rem",
                        position: 'absolute',
                        bottom: 'var(--safe-area-inset-bottom, 0px)',
                        backgroundColor: color,
                        width: '100%'
                    }}>
                        {/* <div className="column snug">
                            <MenuItem
                                onClick={() => {
                                    pleasePush('/our-values')
                                }}
                                icon={<ArrowForward fontSize="small" />}
                            >Our Values</MenuItem>
                            <MenuItem
                                onClick={() => {
                                    pleasePush('/contact')
                                }}
                                icon={<EmailOutlined fontSize="small" />}
                            >Contact</MenuItem>
                        </div> */}

                        <div className="column" style={{
                            padding: "0 2rem"
                        }}>
                            <div className="column">
                                <div className="flex compact">
                                    <IconButton
                                        href="https://www.instagram.com/terandina.apparel/"
                                        onClick={e => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            window.open('https://www.instagram.com/terandina.apparel/', '_blank')
                                        }}
                                    >
                                        <Instagram fontSize="small" />
                                    </IconButton>
                                </div>
                                <div className="column snug">
                                    <Typography variant="h6" sx={{
                                        textTransform: 'uppercase',
                                        fontSize: "1rem"
                                    }}>Subscribe to our Newsletter</Typography>
                                    <TextField
                                        variant="standard"
                                        placeholder="Email Address"
                                        slotProps={{
                                            input: {
                                                endAdornment: (
                                                    <IconButton>
                                                        <ArrowForward sx={{
                                                            fontSize: '1.25rem'
                                                        }} />
                                                    </IconButton>
                                                )
                                            }
                                        }}
                                    />
                                </div>

                            </div>
                            <div className="flex between">
                            <Typography sx={{
                                        fontSize: "0.85rem"
                                    }}>Terandina Inc. Copyright 2025.</Typography>
                                    <Link href="/login" sx={{
                                        fontSize: "0.85rem"
                                    }}>Login</Link>
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
                        <>
                            {router.asPath != '/checkout' ? (
                                <div className="flex fit">
                                    <IconButton onClick={() => {
                                        window.scrollTo(0, 1)
                                        handleSwitchTab('menu')
                                        isSidebarOpen ? handleCloseSidebar() : handleOpenSidebar()
                                    }}>
                                        {isSidebarOpen ? <CloseOutlined /> : <MenuOutlined />}
                                    </IconButton>
                                </div>
                            ) : (
                                <div className="flex fit">
                                    <IconButton onClick={() => {
                                        router.back();
                                    }}>
                                        <ArrowBack fontSize="small" />
                                    </IconButton>
                                </div>
                            )}
                        </>
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
                                onClick={() => pleasePush('/')}
                                style={{
                                    width: "auto",
                                    height: "4rem",
                                    opacity: 0
                                }} />
                        ) : (
                            <Image id="logo" src={TerandinaLogo} alt="Terandina"
                                onClick={() => pleasePush('/')}
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
                                                pleasePush('/admin/categories')
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
                        {router.asPath != "/checkout" && (
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
                                {/* <ScrollButton variant="contained" onClick={() => pleasePush('/products')} sx={{
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