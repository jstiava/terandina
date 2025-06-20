import { useMediaQuery, useTheme } from "@mui/material";
import { JSX } from "react"
import { headerHeight } from "./AuthProvider";
import { AccountBalanceOutlined, CategoryOutlined, CheckroomOutlined, Inventory2Outlined } from "@mui/icons-material";
import { useRouter } from "next/router";
import MenuItem from "@/components/MenuItem";


const items = [
    {
        name: "Products",
        slug: 'products',
        icon: <CheckroomOutlined />
    },
    {
        name: "Inventory",
        slug: "inventory",
        icon: <Inventory2Outlined />
    },
    {
        name: "Categories",
        slug: "categories",
        icon: <CategoryOutlined />
    },
     {
        name: "Charges",
        slug: "charges",
        icon: <AccountBalanceOutlined />
    }
]

export default function AdminWrapper({
    children
}: {
    children: JSX.Element
}) {

    const theme = useTheme();
    const router = useRouter();

    const isSm = useMediaQuery("(max-width: 90rem)");
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    console.log(router)

    return (
        <div id="content"
            className="column center"
            style={{
                padding: isMobile ? "1rem 0" : "1rem"
            }}>
            <div className={isSm ? "column left" : "column left"} style={{
                marginTop: headerHeight,
                maxWidth: "120rem",
                padding: isSm ? "0" : "0.5rem",
                width: "100%"
            }}>


                <div className="flex compact">

                    {items.map(x => {

                        const focused = x.slug === 'products' ? router.route.endsWith(x.slug) || router.route.endsWith('admin') : router.route.endsWith(x.slug);

                        return (
                            <MenuItem
                                key={x.slug}
                                focused={focused}
                                onClick={() => {
                                    router.push(`/admin/${x.slug}`)
                                }}
                                icon={x.icon}
                                reverse
                                style={{
                                    width: "fit-content",
                                    padding: "0 0 0 1rem",
                                    backgroundColor: focused ? "#00000010" : "#00000000"
                                }}
                            >

                                {x.name}
                            </MenuItem>
                        )
                    })}

                </div>

                {children}
            </div>
        </div>
    )
}