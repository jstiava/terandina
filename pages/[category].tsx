'use client'
import CoverImage from "@/components/CoverImage";
import ProductCard from "@/components/ProductCard";
import ScrollButton from "@/components/ScrollButton";
import { Category, StripeAppProps, StripePrice, StripeProduct } from "@/types";
import Mongo from "@/utils/mongo";
import { Typography, useMediaQuery, useTheme } from "@mui/material";
import { GetStaticPaths } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getAllProducts } from "./api/products";
import { ObjectId, WithId } from "mongodb";
import { getAllCategories } from "./api/categories";


interface StaticProps {
  notFound?: boolean;
  tag: Category | null;
  category: Category;
  products?: StripeProduct[]
}

export const getStaticPaths = (async (context: any) => {

  console.log(context);

  const mongo = await Mongo.getInstance()
  const categories = await mongo.clientPromise.db('products').collection('categories').find().toArray();

  return {
    paths: categories.map(cat => ({
      params: {
        category: cat.slug,
      }
    })),
    fallback: true
  }
});

export const getStaticProps = (async (context: any) => {

  let products = null;
  const slug = context.params?.category;

  if (!slug) {
    console.log("No slug")
    return {
      notFound: true
    }
  }

  const mongo = await Mongo.getInstance();
  const [category] = await mongo.clientPromise.db('products').collection('categories').find({ slug, type: 'collection' }).toArray();

  if (!category) {
    return {
      notFound: true
    }
  }

  products = await getAllProducts({
    category: category._id.toString()
  })

  if (!products) {
    return {
      notFound: true
    }
  }

  for (const p of products) {
    if (!p.categories) {
      continue;
    }

    const cats = await getAllCategories({
      cat_ids: p.categories.map((c: ObjectId) => c.toString())
    }, {
      getProductsIfVariant: true
    });

    p.quantity = 1;
    p.selectedPrice = p.prices ? p.prices[0] : null;
      p.categories = cats;
  }

  try {

    return {
      props: {
        static: {
          category: {
            ...category,
            _id: category._id.toString()
          },
          products: JSON.parse(JSON.stringify(products))
        },
      }
    }
  }
  catch (err) {
    console.log(err);
  }
})

export const TerandinaGreen = '#005445'

export default function CategoryPage(props: StripeAppProps & {
  static: StaticProps
}) {

  const theme = useTheme();
  const router = useRouter();
  const isSm = useMediaQuery("(max-width: 45rem)");
  const isMd = useMediaQuery("(max-width: 70rem)");

  useEffect(() => {
    if (props && props.static) {
      if (props.static.notFound) {
        router.back();
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  if (!props || !props.static || !props.static.category) {
    return <></>
  }

  return (
    <>
      <Head>
        <title>Terandina - Handcrafted Native Outerwear and Accessories</title>
      </Head>
      <div className="flex center" style={{
        position: 'fixed',
        zIndex: 1,
        top: '4rem',
        padding: `0 ${isSm ? '1rem' : '2rem'}`,
        height: "3.5rem",
        borderBottom: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
        animation: 'fade 0.2s ease-in-out forwards'
      }}>
        <Typography variant="h5">{props.static.tag ? `${props.static.tag.name} ` : ''}{props.static.category.name}</Typography>
      </div>
      <div className="column center" style={{
        width: "100%",
        padding: 0,
        marginTop: "8rem"
      }}>

        <div className={'flex between top'} style={{
          flexWrap: 'wrap',
          color: theme.palette.text.primary,
          maxWidth: "80rem",
          width: "100%",
          minHeight: "100vh",
          padding: "1rem"
        }}>
          <div className={isMd ? "column center relaxed" : "flex fit middle relaxed"} style={{
            padding: isMd ? "1.5rem 2rem 3rem 2rem" : "5rem 1rem",
            width: '100%',
            margin: isMd ? isSm ? "0rem 0rem 2rem 0rem" : "1rem 2rem" : "1rem 2rem",
            backgroundColor: TerandinaGreen,
            color: theme.palette.getContrastText(TerandinaGreen),
            backgroundImage: props.static.category.media && props.static.category.media.length > 0 ? `url(${props.static.category.media[0].large})` : `url(./ecuador-landscape-sunrise-morning-preview.jpg)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}>
            <div className="column snug center middle" style={{
              minHeight: "20vh",
              height: "fit-content",
            }}>
              <div className="column center middle">
                <Typography variant="h1" sx={{
                  fontSize: isMd ? '3rem' : "4rem",
                }}>{props.static.category.name}</Typography>
              </div>
            </div>
          </div>
          {props.static.products && props.static.products.map((product, index) => {
            const row = Math.floor(index / 3);
            const col = index % 3;

            // Compute animation delay
            const delay = (row + col) * 100;
            return (
              <ProductCard
                key={product.id}
                product={product}
                addToCart={!isSm ? props.Cart.add : undefined}
                categories={props.categories}
                style={{
                  animationDelay: `${delay}ms`,
                  width: isSm ? "calc(50% - 0.5rem)" : "calc(33% - 0rem)",
                  marginRight: isSm && index % 2 === 0 ? "1rem" : 0,
                  marginBottom: isSm ? "1rem" : "0rem"
                }}
              />
            )
          })}
        </div>
      </div>
    </>
  )
}