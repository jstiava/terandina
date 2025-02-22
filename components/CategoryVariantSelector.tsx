import { Category, StripeProduct } from "@/types";
import CoverImage from "./CoverImage";
import { ButtonBase, Tooltip, useTheme } from "@mui/material";
import { useRouter } from "next/router";


export default function CategoryVariantSelector({ product, category, size = 'medium' }: { product : StripeProduct, category: Category, size : 'small' | 'medium' | 'large' }) {

    const theme = useTheme();
    const router = useRouter();

    return (
        <div className="flex compact">
            {category.products.map(p => {
                return (
                    <Tooltip
                    key={p.id}
                    title={p.name}
                    placement="top"
                    >
                       <ButtonBase 
                        onClick={() => router.push(`/item/${p.id}`)}
                       >
                       <CoverImage
                            url={p.images[0]}
                            width={size === 'small' ? "2.25rem" : "3rem"}
                            height={size === "small" ? "2.25rem" : "3rem"}
                            style={{
                                borderRadius: "100%",
                                border: product.id === p.id ? `0.2rem solid ${theme.palette.primary.main}` : `0.15rem solid ${theme.palette.divider}`,
                                backgroundSize: "250%"
                            }}
                        ></CoverImage>
                       </ButtonBase>
                    </Tooltip>
                )
            })}
        </div>
    )
}