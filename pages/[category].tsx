'use client'
import CoverImage from "@/components/CoverImage";
import ProductCard from "@/components/ProductCard";
import ScrollButton from "@/components/ScrollButton";
import { Category, StripeAppProps, StripePrice, StripeProduct } from "@/types";
import Mongo from "@/utils/mongo";
import { alpha, ButtonBase, IconButton, Link, Typography, useMediaQuery, useTheme } from "@mui/material";
import { GetStaticPaths } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getAllProducts } from "./api/products";
import { ObjectId, WithId } from "mongodb";
import { getAllCategories } from "./api/categories";
import CategorySection from "@/components/CategorySection";
import { FilterOutlined, SortOutlined } from "@mui/icons-material";
import anime from "animejs";


export interface CategoryStaticProps {
  notFound?: boolean;
  tag: Category | null;
  category?: Category & { categories: Category[] };
  categories?: Category[];
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
      cat_ids: (p.categories as any).map((c: ObjectId) => c.toString())
    }, {
      getProductsIfVariant: true
    });

    p.quantity = 1;
    p.selectedPrice = p.prices ? p.prices[0] : null;
    p.categories = cats;
  }


  if (category.categories) {
    const cats = await getAllCategories({
      cat_ids: (category.categories as any).map((c: ObjectId) => c.toString())
    }, {
      getProducts: true
    });

    console.log(cats.map(x => x.name))

    return {
      props: {
        static: {
          categories: JSON.parse(JSON.stringify(cats)),
          category: {
            ...category,
            _id: category._id.toString(),
            categories: null
          },
        }
      }
    }
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
  static: CategoryStaticProps
}) {

  const theme = useTheme();
  const router = useRouter();
  const isSm = useMediaQuery("(max-width: 45rem)");
  const isMd = useMediaQuery("(max-width: 70rem)");
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);

  useEffect(() => {
    anime({
      targets: ".subSectionButton",
      opacity: [0, 1],
      duration: 300,
      easing: "easeInOutQuad",
      delay: (el, i) => (100 * i) + 100,
    });
  }, [isSm]);

  useEffect(() => {
    anime({
      targets: ".actionButton",
      opacity: [0, 1],
      duration: 300,
      easing: "easeInOutQuad",
      delay: (el, i) => (100 * i) + 100,
    });
  }, [isSm, currentCategory]);

  useEffect(() => {
    const handleScroll = () => {
      // Get the current scroll position
      const scrollY = window.scrollY;

      // Get all elements with the class "Category Section"
      const categories = Array.from(document.querySelectorAll('.categorySection')) as HTMLElement[];

      console.log(categories);


      // Find the category currently visible in the viewport
      for (let i = 0; i < categories.length; i++) {
        const category = categories[i];
        const categoryTop = category.getBoundingClientRect().top + scrollY; // Get Y-coordinate relative to the page

        // Check if the category is within the viewport
        if (scrollY >= categoryTop - window.innerHeight / 2 && scrollY < categoryTop + category.offsetHeight - window.innerHeight / 2) {
          setCurrentCategory(category.id); // Or any other identifier for the category
          break;
        }
      }
    };

    // Attach the scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Cleanup on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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
      <div className="flex between" style={{
        position: 'fixed',
        zIndex: 1,
        top: '4rem',
        padding: `0 ${isSm ? '1rem' : '2rem'}`,
        height: "3.5rem",
        borderBottom: `1px solid ${theme.palette.divider}`,
        // backgroundColor: theme.palette.background.paper,
        backgroundColor: alpha('#f4f4f4', 0.9),
        animation: 'fade 0.2s ease-in-out forwards'
      }}>
        <Typography variant="h5">{props.static.tag ? `${props.static.tag.name} ` : ''}{props.static.category.name}</Typography>
        <div className="flex fit" style={{
          marginLeft: "1rem"
        }}>
          {props.static.categories && (
            <>
              {isSm ? (
                <div className="flex compact fit" key="small">
                  {currentCategory && props.static.categories.map((cat) => {

                    if (currentCategory != cat.slug) {
                      return null;
                    }

                    return (
                      <ButtonBase
                        disableRipple
                        key={cat._id}
                        href={`#${cat.slug}`}
                        //  onClick={() => {
                        //      !isSidebarOpen && setActiveMenu(item.value);
                        //      handleSwitchTab(item.value)
                        //      handleOpenSidebar();
                        //  }}
                        className="actionButton"
                        sx={{
                          display: 'inline',
                          textDecoration: `none`,
                          transition: `background-size .3s`,
                          cursor: "pointer",
                          whiteSpace: "pre-line",
                          fontWeight: 800,
                          textAlign: 'left',
                          height: "fit-content",
                          '&:hover': {
                            backgroundSize: "0 0.1rem, 100% 0.1rem",
                          },
                          opacity: 0,
                          color: theme.palette.text.primary
                        }}>
                        <Typography variant="h6"
                          sx={{
                            textTransform: "uppercase",
                            letterSpacing: "0.05rem",
                            fontSize: "0.875rem",
                          }}>{cat.name}</Typography>
                      </ButtonBase>
                    )
                  })}

                  <IconButton key="outline">
                    <SortOutlined sx={{
                      fontSize: '1.25rem'
                    }} />
                  </IconButton>
                </div>
              ) : (
                <>
                  {props.static.categories.map((cat) => (
                    <ButtonBase
                      disableRipple
                      key={cat._id}
                      href={`#${cat.slug}`}
                      //  onClick={() => {
                      //      !isSidebarOpen && setActiveMenu(item.value);
                      //      handleSwitchTab(item.value)
                      //      handleOpenSidebar();
                      //  }}
                      className="subSectionButton"
                      sx={{
                        display: 'inline',
                        backgroundImage: `linear-gradient(#00000000, #00000000), linear-gradient(#000000, #000000)`,
                        textDecoration: `none`,
                        backgroundSize: currentCategory === cat.slug ? "0 0.1rem, 100% 0.1rem" : `100% 0.1rem, 0 0.1rem`,
                        backgroundPosition: `100% 1.25rem, 0 1.25rem`,
                        backgroundRepeat: `no-repeat`,
                        transition: `background-size .3s`,
                        cursor: "pointer",
                        whiteSpace: "pre-line",
                        fontWeight: 800,
                        textAlign: 'left',
                        height: "2rem",
                        '&:hover': {
                          backgroundSize: "0 0.1rem, 100% 0.1rem",
                        },
                        opacity: 0,
                        color: theme.palette.text.primary
                      }}>
                      <Typography variant="h6"
                        sx={{
                          textTransform: "uppercase",
                          letterSpacing: "0.05rem",
                          fontSize: "0.875rem",
                        }}>{cat.name}</Typography>
                    </ButtonBase>
                  ))}
                </>
              )}
            </>
          )}
        </div>
      </div>

      {props.static.categories ? (
        <div className="column snug">
          {props.static.categories.map(cat => (
            <CategorySection
              key={cat._id}
              Cart={props.Cart}
              categories={props.categories || []}
              category={cat}
              products={cat.products}
            />
          ))}
        </div>
      ) : (
        <CategorySection
          Cart={props.Cart}
          categories={props.categories || []}
          category={props.static.category}
          products={props.static.products || []}
        />
      )}

    </>
  )
}