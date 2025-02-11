import CoverImage from "@/components/CoverImage";
import ProductCard from "@/components/ProductCard";
import { StripeAppProps, StripeProduct } from "@/types";
import fetchAppServer from "@/utils/fetch";
import { Button, Typography, useMediaQuery, useTheme } from "@mui/material";
import anime from "animejs";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import HeroImage from '@/public/BSP_191_Cotopaxi+sunset.jpg'


export default function Home(props: StripeAppProps) {

  const router = useRouter();
  const theme = useTheme();
  const [products, setProducts] = useState<StripeProduct[] | null>(null);

  const isSm = useMediaQuery(theme.breakpoints.down('sm'));


  const getProducts = async () => {

    let productList = [];
    let i = 0;

    const productsFetch = await fetch('/api/products');

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
          padding: "1rem",
        }}>
          <CoverImage
          delay={0.5}
          url="/no_license_landscape.jpg"
          height={"calc(100vh - 6rem)"}
          width={"100%"}
          className={isSm ? 'column bottom' : 'flex between bottom'}
           style={{
            position: 'relative',
            backgroundImage: 'url(/no_license_landscape.jpg)',
            overflow: "hidden",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            padding: "2rem",
          }}
          >
            <div className="flex fit">
              <Typography sx={{
                lineHeight: "115%",
                color: '#000000',
              }} 
              variant="h1"
              >Crafted in the Andes<br />Rooted in Tradition</Typography>
            </div>
            <div className="flex fit">
              <Button variant="contained" onClick={() => {
                router.push('/products')
              }}>Shop All</Button>
            </div>
          </CoverImage>
        </div>
      </div>
    </>
  );
}
