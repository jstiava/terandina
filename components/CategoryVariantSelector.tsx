import { Category, StripeProduct } from "@/types";
import CoverImage from "./CoverImage";
import { Avatar, AvatarGroup, ButtonBase, Tooltip, useTheme } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import { AddOutlined, MoreHorizOutlined, MoreOutlined } from "@mui/icons-material";


export default function CategoryVariantSelector({ product, category, size = 'medium', onMore, onClose, limit = 30 }: { product: StripeProduct, category: Category, size?: 'small' | 'medium' | 'large', onMore?: () => any, onClose: any, limit?: number }) {

    const theme = useTheme();
    const router = useRouter();

    const [action, setAction] = useState<string | null>(null);

    return (

        <AvatarGroup spacing={-2} max={limit + 1} total={limit} onMouseEnter={() => setAction('hovering')}
            onMouseLeave={() => setAction(null)}>
            {category.products.map((p, i) => {

                const isChosen = product.id === p.id;
                const isMediaExisting = (p.media && p.media.length > 0) && p.media[0];

                if (i > limit - 1) {
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
                        <Avatar
                            key={p.id}
                            alt={p.name}
                            src={p.media[0].small || ''}
                            sx={{
                                backgroundSize: "200%"
                            }}
                            onClick={() => {
                                onClose();
                                router.replace(`/item/${p.id}`);
                            }} />
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
        </AvatarGroup>
    )
}