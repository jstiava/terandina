import { CategoryStaticProps, TerandinaGreen } from "@/pages/[category]";
import { useMediaQuery, Typography, useTheme } from "@mui/material";
import { useRouter } from "next/router";
import ProductCard from "./ProductCard";
import { Category, StripeAppProps, StripeProduct } from "@/types";
import { UseCart } from "@/checkout/useCart";


export default function CategorySection({category, products, ...props}: {
    category: Category,
    products: StripeProduct[],
    Cart: UseCart,
    categories: Category[]
}) {

    const theme = useTheme();
    const router = useRouter();
    const isSm = useMediaQuery("(max-width: 45rem)");
    const isMd = useMediaQuery("(max-width: 70rem)");

    
    return (
        <div 
        className="column center" 
        id={category.slug}
        style={{
            width: "100%",
            padding: 0,
            paddingTop: "8rem"
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
                padding: isMd ? "1.5rem 2rem 3rem 2rem" : "9rem 1rem",
                width: '100%',
                margin: isMd ? isSm ? "0rem 0rem 2rem 0rem" : "1rem 2rem" : "1rem 2rem",
                backgroundColor: TerandinaGreen,
                color: theme.palette.getContrastText(TerandinaGreen),
                backgroundImage: category.media && category.media.length > 0 ? `url(${category.media[0].large})` : `url(./ecuador-landscape-sunrise-morning-preview.jpg)`,
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
                      lineHeight: "100%"
                    }}>{category.name}</Typography>
                  </div>
                </div>
              </div>
              {products && products.map((product, index) => {
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
    )
}