import CoverImage from "@/components/CoverImage";
import ProductCard from "@/components/ProductCard";
import { StripeAppProps, StripeProduct } from "@/types";
import fetchAppServer from "@/utils/fetch";
import { Button, IconButton, Typography, useMediaQuery, useTheme } from "@mui/material";
import anime from "animejs";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { CSSProperties, useEffect, useRef, useState } from "react";
import HeroImage from '@/public/BSP_191_Cotopaxi+sunset.jpg'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { ArrowLeft, ArrowLeftOutlined, ArrowRight, ArrowRightOutlined, ChevronLeft, ChevronRight } from "@mui/icons-material";
import TerandinaWordmark from "@/icons/TerandinaWordmark";




export default function Home(props: StripeAppProps) {

  const router = useRouter();
  const theme = useTheme();
  const [products, setProducts] = useState<StripeProduct[] | null>(null);
  const swiperRef = useRef<any>(null);
  const heroSwiperRef = useRef<any>(null);

  const isSm = useMediaQuery(theme.breakpoints.down('sm'));
  const isMd = useMediaQuery(theme.breakpoints.down('md'));

  const [swiperInstance, setSwiperInstance] = useState<typeof Swiper | null>(null);

  const prevRef = useRef(null);
  const nextRef = useRef(null);



  const getProducts = async () => {

    let productList = [];
    let i = 0;


    const productsFetch = await fetch('/api/products?is_featured=true');

    if (!productsFetch.ok) {
      return;
    }

    const response = await productsFetch.json();

    for (i; i < response.products.length; i++) {
      const product = response.products[i];
      if (!product.prices || product.prices.length === 0) {
        continue;
      }
      productList.push({
        ...product,
        quantity: 1,
        selectedPrice: product.prices[0]
      })
    }

    setProducts(productList);
  }

  useEffect(() => {
    getProducts();
  }, []);


  if (!products) {
    return (
      <div
        className="flex center middle"
        style={{
          width: '100vw',
          height: "100vh",
          backgroundColor: "#ffffff",
          backgroundPosition: 'center',
          opacity: 1,
          transform: 'scale(1)',
          transition: `opacity 0.5s ease-in-out ${3}s`,
          // ...style,
        }}
      >
        <CoverImage
          url="/light_bird.png"
          height={"2.5rem"}
          width={"5rem"}
          recursive
        />
      </div>
    )
  }


  return (
    <>
      <Head>
        <title>Terandina - Handcrafted Native Outerwear and Accessories</title>
      </Head>
      <div className="column center"
        style={{
          width: "100%",
          padding: "0",
          marginTop: "4rem"
        }}>
        <div className="flex" style={{
          padding: isSm ? "0rem" : "1rem",
        }}>
          <div className="flex" style={{
            padding: 0,
            width: "100%",
            overflow: 'hidden'
          }}>
            <Swiper
              key={`slider-hero`}
              ref={heroSwiperRef}
              direction="horizontal"
              slidesPerView={1}
              spaceBetween={0}
              // slidesOffsetBefore={-30}
              style={{
                display: 'flex',
                width: "100%",
                height: "fit-content",
                padding: 0,
                "--swiper-theme-color": theme.palette.primary.main,
                "--swiper-pagination-color": "white",  // Active bullet color
                "--swiper-pagination-bullet-inactive-color": "white", // Inactive bullet color
                "--swiper-pagination-bullet-inactive-opacity": "0.5",
                "--swiper-navigation-size": 64,
                "--swiper-navigation-top-offset": "calc(50% - 1rem)",
              } as CSSProperties}
              pagination={{
                clickable: true,
              }}
              modules={[Pagination]}
              breakpoints={{
                300: {
                  slidesPerView: 1,
                  spaceBetween: 0,
                },
              }}
              className="mySwiper"
            >
              {isSm && (
                <SwiperSlide className="slide"
                  key={"cosmic_buffalo"}
                >
                  <CoverImage
                    url="/ring_example.webp"
                    height={isSm ? "calc(90vh - 6rem)" : "calc(100vh - 6rem)"}
                    className={isSm ? 'column center bottom' : 'flex between bottom'}
                    width={"100%"}
                    style={{
                      position: 'relative',
                      backgroundImage: 'url(/ring_example.webp)',
                      overflow: "hidden",
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      padding: "2rem",
                    }}
                  >
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      marginBottom: isSm ? 0 : "-1rem",
                      width: "100%",
                      height: isSm ? "100%" : "30vh",
                      backgroundImage: isSm ? 'radial-gradient(#000000aa, #00000000)' : 'linear-gradient(to top, #000000aa, #00000000)',
                      zIndex: 0
                    }}></div>
                    <div className="flex fit" style={{
                      zIndex: 1,
                      marginBottom: isSm ? "1rem" : "0rem",
                      padding: "1rem",
                    }}>
                      <Typography variant="h2" sx={{
                        color: "white",
                        fontSize: isSm ? "1.5rem" : "2rem",
                        textAlign: isSm ? "center" : "left"
                      }}>Timeless designs <br />that celebrate Indigenous heritage</Typography>
                    </div>
                    <div className={isSm ? "column compact2" : "flex fit"} style={isSm ? {
                      // position: 'absolute',
                      bottom: "2rem",
                      width: "100%",
                      left: 0,
                      padding: "0 2rem"
                    } : {

                    }}>
                      <Button fullWidth={isSm} variant="contained" onClick={() => {
                        router.push('/products')
                      }}>Shop All</Button>
                      <Button fullWidth={isSm} variant="text" onClick={() => router.push('/our-values')} sx={{
                        color: '#ffffff',
                        borderColor: "#ffffff"
                      }}>
                        Our Values
                      </Button>
                    </div>
                  </CoverImage>
                </SwiperSlide>
              )}
              <SwiperSlide className="slide"
                key={"no_license_landscape_timeless_designs"}
              >
                <CoverImage
                  url="/no_license_landscape.jpg"
                  height={isSm ? "calc(90vh - 6rem)" : "calc(100vh - 6rem)"}
                  className={isSm ? 'column center bottom' : 'flex between bottom'}
                  width={"100%"}
                  style={{
                    position: 'relative',
                    backgroundImage: 'url(/no_license_landscape.jpg)',
                    overflow: "hidden",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    padding: "2rem",
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    marginBottom: isSm ? 0 : "-1rem",
                    width: "100%",
                    height: isSm ? "100%" : "30vh",
                    backgroundImage: isSm ? 'radial-gradient(#000000aa, #00000000)' : 'linear-gradient(to top, #000000aa, #00000000)',
                    zIndex: 0
                  }}></div>
                  <div className="flex fit" style={{
                    zIndex: 1,
                    marginBottom: isSm ? "1rem" : "0rem",
                    padding: "1rem",
                  }}>
                    <Typography component="h3" sx={{
                      color: "white",
                      fontSize: isSm ? "1.5rem" : "2rem",
                      textAlign: isSm ? "center" : "left"
                    }}>From Quechua Artisans <br />in the highlands of Ecuador</Typography>
                  </div>

                  <div className={isSm ? "column compact2" : "flex fit"} style={isSm ? {
                    // position: 'absolute',
                    bottom: "2rem",
                    width: "100%",
                    left: 0,
                    padding: "0 2rem"
                  } : {

                  }}>
                    <Button fullWidth={isSm} variant="contained" onClick={() => {
                      router.push('/products')
                    }}>Shop All</Button>
                    <Button fullWidth={isSm} variant="text" onClick={() => router.push('/our-values')} sx={{
                      color: '#ffffff',
                      borderColor: "#ffffff"
                    }}>
                      Our Values
                    </Button>
                  </div>
                </CoverImage>
              </SwiperSlide>
            </Swiper>
          </div>
          {/* <CoverImage
            url="/no_license_landscape.jpg"
            height={isSm ? "calc(90vh - 6rem)" : "calc(100vh - 6rem)"}
            width={"100%"}
            className={isSm ? 'column center bottom' : 'flex between bottom'}
            style={{
              position: 'relative',
              backgroundImage: 'url(/no_license_landscape.jpg)',
              overflow: "hidden",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              padding: "2rem",
            }}
          >
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              marginBottom: isSm ? 0 : "-1rem",
              width: "100%",
              height: isSm ? "100%" : "30vh",
              backgroundImage: isSm ? 'radial-gradient(#000000aa, #00000000)' : 'linear-gradient(to top, #000000aa, #00000000)',
              zIndex: 0
            }}></div>
            <div className="flex fit" style={{
              zIndex: 1,
              marginBottom: isSm ? "5rem" : "0rem"
            }}>
              <Typography variant="h2" sx={{
                color: "white"
              }}>Timeless designs <br/>that celebrate Indigenous heritage</Typography>
            </div>
            <div className={isSm ? "column compact2" : "flex fit"} style={isSm ? {
              position: 'absolute',
              bottom: "2rem",
              width: "100%",
              left: 0,
              padding: "0 2rem"
            } : {

            }}>
              <Button fullWidth={isSm} variant="contained" onClick={() => {
                router.push('/products')
              }}>Shop All</Button>
              <Button fullWidth={isSm} variant="text" onClick={() => router.push('/our-values')} sx={{
                color: '#ffffff',
                borderColor: "#ffffff"
              }}>
                Our Values
              </Button>
            </div>
          </CoverImage> */}
        </div>

        <div className="column center" style={{
          position: 'relative',
          padding: isSm ? "2rem 0rem" : "1rem 0",
          width: "100%",
          '--swiper-navigation-size': "1rem"
        } as any}>
          <Typography variant="h6">Best Sellers</Typography>
          <div className="flex" style={{
            padding: isSm ? "0 1rem" : "0rem 3rem",
          }}>
              <Swiper
                ref={swiperRef}
                direction="horizontal"
                slidesPerView={1}
                spaceBetween={10}
                navigation={{
                  nextEl: '.swiper-button-next',
                  prevEl: '.swiper-button-prev',
                  disabledClass: 'swiper-button-disabled', // ✅ REQUIRED
                }}
                onBeforeInit={(swiper) => {
                  swiper.navigation.init();
                  swiper.navigation.update();
                }}
                centeredSlides={false}
                // slidesOffsetBefore={-30}
                style={{
                  display: 'flex',
                  width: "100%",
                  height: "fit-content",
                  padding: 0,
                  "--swiper-theme-color": theme.palette.primary.main,
                  "--swiper-pagination-color": theme.palette.primary.main,  // Active bullet color
                  "--swiper-pagination-bullet-inactive-color": "gray", // Inactive bullet color
                  "--swiper-pagination-bullet-inactive-opacity": "0.5",
                  "--swiper-navigation-top-offset": "calc(50% - 1rem)",
                } as CSSProperties}
                pagination={{
                  clickable: true,
                }}
                modules={[Pagination, Navigation]}
                breakpoints={{
                  300: {
                    slidesPerView: 1.4,
                    spaceBetween: 10,
                  },
                  500: {
                    slidesPerView: 2.4,
                    spaceBetween: 0
                  },
                  1200: {
                    slidesPerView: 3.4,
                    spaceBetween: 10
                  },
                  1400: {
                    slidesPerView: 4.4,
                    spaceBetween: 10,
                  },
                  1800: {
                    slidesPerView: 5.4,
                    spaceBetween: 10,
                  },
                }}
                className="mySwiper"
              >
                {products.map(product => (
                  <SwiperSlide className="slide" key={product.id}>
                    <div className="flex center middle" style={{
                      padding: isSm ? "1rem" : 0
                    }}>
                      <ProductCard
                        product={product}
                        addToCart={!isSm ? props.Cart.add : undefined}
                        style={{
                          animationDelay: `${0}ms`,
                          // width: "100%"
                        }}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            {!isSm && (
              <>
                <IconButton ref={prevRef} className="custom-prev swiper-button-prev" sx={{
                  position: 'absolute',
                  left: "0.25rem",
                  zIndex: 1,
                  fontSize: "1rem",
                  padding: "1.5rem"
                }}>
                  <ChevronLeft sx={{ fontSize: "1rem" }} />
                </IconButton>
                <IconButton ref={nextRef} className="custom-prev swiper-button-next" sx={{
                  position: 'absolute',
                  right: "0.25rem",
                  zIndex: 1,
                  fontSize: "1rem",
                  padding: "1.5rem"
                }}>
                  <ChevronRight sx={{ fontSize: "1rem" }} />
                </IconButton>
              </>
            )}
          </div>
        </div>
        <div className={isSm ? 'column snug' : "flex snug"} style={{
          position: 'relative',
          width: "100%"
        }}>
          <CoverImage
            className="column snug center middle"
            url="/poncho_cover.jpg"
            width={isSm ? "100%" : "50vw"}
            height="auto"
            style={{
              aspectRatio: "1/1",
              // backgroundImage: 'url(/poncho_cover.jpg)',
            }}
          >
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundImage: 'radial-gradient(#000000aa, #00000000)',
              zIndex: 0
            }}></div>
            <Typography variant="h2" sx={{
              padding: "1.5rem",
              //  border: "0.25rem solid white",
              color: 'white',
              zIndex: 1,
              textAlign: 'center'
            }}>Explore All Ponchos</Typography>
            <Button
              variant="contained"
              onClick={() => router.push('/ponchos')}
            >Shop Ponchos</Button>
          </CoverImage>
          <CoverImage
            className="column compact center middle"
            url="/jewelry_cover.jpg"
            width={isSm ? "100%" : "50vw"}
            height="auto"
            style={{
              aspectRatio: "1/1",
              position: 'relative',
              // backgroundImage: 'url(/jewelry_cover.jpg)',
              overflow: "hidden",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundImage: 'radial-gradient(#000000aa, #00000000)',
              zIndex: 0
            }}></div>
            <Typography variant="h2" sx={{
              padding: "1.5rem",
              //  border: "0.25rem solid white",
              textAlign: 'center',
              color: 'white',
              zIndex: 1
            }}>Explore All Jewelry</Typography>
            <Button
              variant="contained"
              onClick={() => router.push('/jewelry')}
            >Shop Jewelry</Button>
          </CoverImage>

        </div>
      </div>
    </>
  );
}


