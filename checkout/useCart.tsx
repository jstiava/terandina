import { StripePrice, StripeProduct } from "@/types";
import { useState } from "react";


export interface UseCart {
    cart: StripeProduct[] | null;
    isSidebarOpen: boolean;
    toggleSidebar: () => boolean;
    add: (item: StripeProduct) => boolean;
    remove: (id: string) => boolean;
    get: (id: string) => StripeProduct | null;
    swap: (removedItem: StripeProduct, newItem: StripeProduct) => void;
    checkout: () => void;
}

export default function useCart() {

    const [cart, setCart] = useState<StripeProduct[] | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

    const add = (item: StripeProduct) => {
        setIsSidebarOpen(true);

        const existingItem = get(item.selectedPrice.id);
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

    const remove = (price_id: string) => {

        setCart(prev => {
            if (!prev) {
                return [];
            }
            const newCart = prev.filter(p => p.selectedPrice.id != price_id);
            return newCart;
        })
        return false;
    }

    const get = (price_id: string) => {

        if (!cart) {
            return null;
        }

        return cart.find(product => product.selectedPrice.id === price_id) || null;
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
        const filtered = cart.filter(p =>  p.selectedPrice.id != removedItem.selectedPrice.id);

        const alreadyExists = filtered.find(p => p.selectedPrice.id === newItem.selectedPrice.id);

        if (!alreadyExists) {
            setCart([...filtered, newItem])
            return;
        }

        const filteredAgain = filtered.filter(p =>  p.selectedPrice.id != newItem.selectedPrice.id);

        setCart([...filteredAgain, {
            ...alreadyExists,
            quantity: alreadyExists.quantity + 1
        }])
        return;

    }

    const checkout = () : {price: StripePrice, quantity: number}[] => {
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