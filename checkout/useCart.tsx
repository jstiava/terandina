"use client"
import { StripePrice, StripeProduct } from "@/types";
import { useEffect, useState } from "react";


export interface UseCart {
    cart: StripeProduct[] | null;
    isSidebarOpen: boolean;
    toggleSidebar: () => boolean;
    add: (item: StripeProduct) => boolean;
    remove: (id: string, size: any) => boolean;
    get: (id: string, size: any) => StripeProduct | null;
    swap: (removedItem: StripeProduct, newItem: StripeProduct) => void;
    checkout: () => void;
}

export default function useCart() {

    const [cart, setCart] = useState<StripeProduct[] | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

    useEffect(() => {
        if (!cart) {
            const savedCart = localStorage.getItem("cart");
            if (savedCart) {
                setCart(JSON.parse(savedCart));
            }
        }
    }, [])

    useEffect(() => {
        if (!cart) {
            return;
        }
        localStorage.setItem("cart", JSON.stringify(cart))
        
    }, [cart])

    const add = (item: StripeProduct) => {
        setIsSidebarOpen(true);

        if (!item.selectedPrice) {
            return false;
        }

        const existingItem = get(item.selectedPrice.id, item.size);
        if (existingItem) {
            return false;
        }

        setCart(prev => {
            if (!prev) {
                return [item]
            }
            return [...prev, item]
        })

        return true;
    }

    const remove = (price_id: string, size : any) => {

        setCart(prev => {
            if (!prev) {
                return [];
            }
            const newCart = prev.filter(p => p.selectedPrice?.id === price_id ? p.size != size : true);
            return newCart;
        })
        return false;
    }

    const get = (price_id: string, size: any) => {

        if (!cart) {
            return null;
        }

        return cart.find(product => product.selectedPrice?.id === price_id ? product.size === size : false) || null;
    }

    const toggleSidebar = () => {
        let newValue = false;
        setIsSidebarOpen(prev => {
            newValue = !prev;
            return newValue;
        });
        return newValue;
    }

    const swap = (removedItem: StripeProduct, newItem: StripeProduct) => {

        if (!cart) {
            setCart([newItem]);
            return;
        }
        const filtered = cart.filter(p => {
            return p.selectedPrice?.id === removedItem.selectedPrice?.id ? p.size != removedItem.size : true
        });

        const alreadyExists = filtered.find(p => {
            return p.selectedPrice?.id === newItem.selectedPrice?.id ? p.size === newItem.size : false
        });

        if (!alreadyExists) {
            setCart([...filtered, newItem])
            return;
        }

        const filteredAgain = filtered.filter(p =>  {
            return p.selectedPrice?.id === newItem.selectedPrice?.id ? p.size != newItem.size : true
        });

        setCart([...filteredAgain, {
            ...alreadyExists,
            quantity: alreadyExists.quantity + 1
        }])
        return;

    }

    const checkout = () : {price: StripePrice | null, quantity: number}[] => {
        if (!cart) {
            return [];
        }
        return cart.map(x => ({
            price: x.selectedPrice,
            quantity: x.quantity || 1
        }))
    }

    return { cart, add, remove, get, isSidebarOpen, toggleSidebar, swap, checkout }
}