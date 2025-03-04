import CoverImage from "@/components/CoverImage";
import ProductCard from "@/components/ProductCard";
import { StripeAppProps, StripeProduct } from "@/types";
import fetchAppServer from "@/utils/fetch";
import { Button, Typography, useMediaQuery, useTheme } from "@mui/material";
import anime from "animejs";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { CSSProperties, useEffect, useRef, useState } from "react";
import HeroImage from '@/public/BSP_191_Cotopaxi+sunset.jpg'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';




export default function Home(props: StripeAppProps) {

  const router = useRouter();
  const theme = useTheme();
  const [products, setProducts] = useState<StripeProduct[] | null>(null);
  const swiperRef = useRef<any>(null);

  const isSm = useMediaQuery(theme.breakpoints.down('sm'));


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
    return <></>
  }


  return (
    <>
      <Head>
        <title>Terandina - Handcrafted Native Outerwear and Accessories</title>
        <link rel="icon" type="image/png" href="/Terandina_no_text.png" />
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
          <CoverImage
            delay={0.5}
            url="/no_license_landscape.jpg"
            height={isSm ? "calc(90vh - 6rem)" : "calc(100vh - 6rem)"}
            width={"100%"}
            className={isSm ? 'column center middle' : 'flex between bottom'}
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
              zIndex: 1
            }}>
              {isSm ? (
                <Typography sx={{
                  lineHeight: "115%",
                  color: '#ffffff',
                  textAlign: isSm ? 'center' : 'left',
                  padding: "1.5rem",
                  border: "0.25rem solid white",
                  marginBottom: "1rem",
                  fontSize: isSm ? "1.85rem" : "2rem"
                }}
                  variant="h1"
                >Crafted<br /> in the Andes<br />Rooted in <br />Tradition</Typography>
              ) : (
                <Typography sx={{
                  lineHeight: "115%",
                  color: '#ffffff',
                  textAlign: isSm ? 'center' : 'left'
                }}
                  variant="h1"
                >Crafted in the Andes<br />Rooted in Tradition</Typography>
              )}
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
              <Button fullWidth={isSm} variant="text" onClick={() => router.push('/values')} sx={{
                color: '#ffffff',
                borderColor: "#ffffff"
              }}>
                Our Values
              </Button>
            </div>
          </CoverImage>
        </div>
        <Typography variant="h2">Best Sellers</Typography>
        <div className="flex" style={{
          padding: isSm ? "0" : "0 2rem"
        }}>
          <Swiper
            ref={swiperRef}
            direction="horizontal"
            slidesPerView={1}
            spaceBetween={10}
            navigation={!isSm}
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
              "--swiper-navigation-size": 64,
              "--swiper-navigation-top-offset": "calc(50% - 1rem)",
            } as CSSProperties}
            pagination={{
              clickable: true,
            }}
            modules={[Pagination, Navigation]}
            breakpoints={{
              300: {
                slidesPerView: 1,
                spaceBetween: 10,
              },
              500: {
                slidesPerView: 2,
                spaceBetween: 0
              },
              1200: {
                slidesPerView: 3,
                spaceBetween: 10
              },
              1400: {
                slidesPerView: 4,
                spaceBetween: 10,
              },
              1800: {
                slidesPerView: 5,
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
                  addToCart={props.Cart.add}
                  style={{
                    animationDelay: `${0}ms`,
                    // width: "100%"
                  }}
                  />
                  </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className={isSm  ? 'column snug' : "flex snug"} style={{
          width: "100%"
        }}>
          <CoverImage
          className="column compact center middle"
            url="/poncho_cover.jpg"
            width={ isSm ? "100%" : "50vw"}
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
                zIndex: 1
            }}>Explore All Ponchos</Typography>
            <Button
              variant="contained"
              onClick={() => router.push('/ponchos')}
             >Shop Ponchos</Button>
          </CoverImage>
          <CoverImage
          className="column compact center middle"
            url="/jewelry_cover.jpg"
            width={ isSm ? "100%" : "50vw"}
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


