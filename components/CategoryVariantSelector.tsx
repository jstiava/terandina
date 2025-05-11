import { Category, StripeProduct } from "@/types";
import CoverImage from "./CoverImage";
import { Avatar, AvatarGroup, ButtonBase, IconButton, Link, Tooltip, useTheme } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import { AddOutlined, MoreHorizOutlined, MoreOutlined } from "@mui/icons-material";


export default function CategoryVariantSelector({ product, category, size = 'medium', onMore, onClose, limit = 30 }: { product: StripeProduct, category: Category, size?: 'small' | 'medium' | 'large', onMore?: () => any, onClose: any, limit?: number }) {

    const theme = useTheme();
    const router = useRouter();

    const [action, setAction] = useState<string | null>(null);

    return (

        <div className="flex compact top"
        style={{
            maxWidth: "100%",
            flexWrap: 'wrap'
        }}
            onMouseEnter={() => setAction('hovering')}
            onMouseLeave={() => setAction(null)}
        >


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
                        <Link href={`/item/${p.id}`}>
                            <div style={{
                                borderRadius: '100%',
                                padding: isChosen ? '0.25rem' : 0,
                                border: `1.5px solid`,
                                borderColor: isChosen ? theme.palette.primary.main : 'transparent'
                            }}>
                            <Avatar
                                key={p.id}
                                alt={p.name}
                                src={p.media[0].small || ''}

                                sx={{
                                    backgroundSize: "300%",
                                    width: isChosen ? "2rem" : "2.5rem",
                                    height: isChosen ? "2rem" : "2.5rem",
                                }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onClose();
                                    router.replace(`/item/${p.id}`);
                                }} />
                            </div>
                        </Link>
                    </Tooltip>
                )
            })}

            {onMore && (
                <Tooltip
                    key={'More'}
                    title={'See More'}
                    placement="top"
                >
                    <Avatar
                        sx={{
                            backgroundColor: 'transparent',
                            color: theme.palette.primary.main,
                            border: 'none !important'
                        }}
                    >
                        <IconButton
                            href={""}
                            onClick={e => {
                                e.preventDefault();
                                e.stopPropagation();
                                onMore();
                            }}>

                            <MoreHorizOutlined />
                        </IconButton>
                    </Avatar>
                </Tooltip>
            )}
        </div>
    )
}