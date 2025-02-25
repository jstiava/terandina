import { Category, StripeProduct } from "@/types";
import CoverImage from "./CoverImage";
import { ButtonBase, Tooltip, useTheme } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";


export default function CategoryVariantSelector({ product, category, size = 'medium' }: { product: StripeProduct, category: Category, size?: 'small' | 'medium' | 'large' }) {

    const theme = useTheme();
    const router = useRouter();

    const [action, setAction] = useState<string | null>(null);

    return (
        <div className="flex compact"
            onMouseEnter={() => setAction('hovering')}
            onMouseLeave={() => setAction(null)}
        >
            {category.products.map(p => {
                return (
                    <Tooltip
                        key={p.id}
                        title={p.name}
                        placement="top"

                    >
                        <ButtonBase
                            onClick={() => {
                                router.replace(`/item/${p.id}`)
                            }}
                        >
                            <CoverImage
                                url={p.images[0]}
                                width={size === 'small' ? "2.25rem" : "3rem"}
                                height={size === "small" ? "2.25rem" : "3rem"}
                                style={{
                                    borderRadius: "100%",
                                    opacity: product.id === p.id ? 1 : action === 'hovering' ? 1 : 0.25,
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