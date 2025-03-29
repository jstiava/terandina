import { Category, StripeProduct } from "@/types";
import CoverImage from "./CoverImage";
import { Avatar, ButtonBase, Tooltip, useTheme } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import { AddOutlined, MoreHorizOutlined, MoreOutlined } from "@mui/icons-material";


export default function CategoryVariantSelector({ product, category, size = 'medium', onMore, onClose, limit = 30 }: { product: StripeProduct, category: Category, size?: 'small' | 'medium' | 'large', onMore? : () => any, onClose: any, limit : number }) {

    const theme = useTheme();
    const router = useRouter();

    const [action, setAction] = useState<string | null>(null);

    return (
        <div className="flex compact"
        style={{
            flexWrap: "wrap",
            marginBottom: "-0.5rem"
        }}
            onMouseEnter={() => setAction('hovering')}
            onMouseLeave={() => setAction(null)}
        >
            {category.products.map((p, i) => {

                const isChosen = product.id === p.id;
                const isMediaExisting = (p.media && p.media.length > 0) && p.media[0];

                if (i > limit-1) {
                    return null;
                }
                else if (i === limit - 1 && category.products.length <= limit) {
                    // Do nothing
                }

                return (
                    <Tooltip
                        key={p.id}
                        title={p.name}
                        placement="top"
                        sx={{
                            marginBottom: "0.5rem"
                        }}
                    >
                        <ButtonBase
                            onClick={() => {
                                onClose();
                                router.replace(`/item/${p.id}`);
                            }}
                        >
                            <CoverImage
                                url={isMediaExisting ? p.media[0].small || '' : ''}
                                width={size === 'small' ? isChosen ? "2.25rem" : "2rem" : isChosen ? "2.75rem" : "2.5rem"}
                                height={size === "small" ? isChosen ? "2.25rem" : "2rem" : isChosen ? "2.75rem" : "2.5rem"}
                                style={{
                                    borderRadius: "100%",
                                    opacity: 1,
                                    border: isChosen ? `0.25rem solid ${theme.palette.primary.main}` : '0.25rem solid transparent',
                                    backgroundSize: "250%",
                                }}
                            ></CoverImage>
                        </ButtonBase>
                    </Tooltip>
                )
            })}

           {onMore && (
             <Avatar
             sx={{
                 backgroundColor: 'transparent',
                 color: theme.palette.primary.main
             }}
                onClick={e => {
                 e.stopPropagation();
                 onMore();
             }}
             >
                 <MoreHorizOutlined />
             </Avatar>
           )}
        </div>
    )
}