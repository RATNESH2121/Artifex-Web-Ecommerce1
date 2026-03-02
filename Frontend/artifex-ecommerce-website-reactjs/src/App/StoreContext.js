import React, { createContext, useContext, useState, useEffect } from "react";

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
    
    const [cart, setCart] = useState(() => {
        try {
            const savedCart = localStorage.getItem("artifex_cart");
            return savedCart ? JSON.parse(savedCart) : { items: [], totalAmount: 0 };
        } catch (e) {
            console.error("Failed to parse cart from localStorage", e);
            return { items: [], totalAmount: 0 };
        }
    });

    
    const [wishlist, setWishlist] = useState(() => {
        try {
            const savedWishlist = localStorage.getItem("artifex_wishlist");
            return savedWishlist ? JSON.parse(savedWishlist) : { items: [] };
        } catch (e) {
            console.error("Failed to parse wishlist from localStorage", e);
            return { items: [] };
        }
    });

    
    useEffect(() => {
        localStorage.setItem("artifex_cart", JSON.stringify(cart));
    }, [cart]);

    useEffect(() => {
        localStorage.setItem("artifex_wishlist", JSON.stringify(wishlist));
    }, [wishlist]);

    
    const addToCart = (product) => {
        setCart((prev) => {
            const existingItem = prev.items.find((item) => item.productID === product.productID);
            const MAX_QUANTITY = 20;
            const quantityToAdd = product.quantity || 1;

            if (existingItem) {
                const newQuantity = Math.min(existingItem.quantity + quantityToAdd, MAX_QUANTITY);
                const actualAdded = newQuantity - existingItem.quantity;

                const updatedItems = prev.items.map((item) =>
                    item.productID === product.productID
                        ? { ...item, quantity: newQuantity }
                        : item
                );
                return {
                    ...prev,
                    items: updatedItems,
                    totalAmount: prev.totalAmount + (actualAdded * product.productPrice),
                };
            } else {
                const initialQuantity = Math.min(quantityToAdd, MAX_QUANTITY);
                return {
                    ...prev,
                    items: [...prev.items, { ...product, quantity: initialQuantity }],
                    totalAmount: prev.totalAmount + (initialQuantity * product.productPrice),
                };
            }
        });
    };

    const removeFromCart = (productID) => {
        setCart((prev) => {
            const itemToRemove = prev.items.find((item) => item.productID === productID);
            if (!itemToRemove) return prev;

            return {
                ...prev,
                items: prev.items.filter((item) => item.productID !== productID),
                totalAmount: prev.totalAmount - itemToRemove.productPrice * itemToRemove.quantity,
            };
        });
    };

    const updateQuantity = (productID, quantity) => {
        setCart((prev) => {
            const itemToUpdate = prev.items.find((item) => item.productID === productID);
            if (!itemToUpdate) return prev;

            const MAX_QUANTITY = 20;
            const finalQuantity = Math.min(Math.max(1, quantity), MAX_QUANTITY);
            const difference = finalQuantity - itemToUpdate.quantity;

            const updatedItems = prev.items.map((item) =>
                item.productID === productID ? { ...item, quantity: finalQuantity } : item
            );

            return {
                ...prev,
                items: updatedItems,
                totalAmount: prev.totalAmount + difference * itemToUpdate.productPrice,
            };
        });
    };

    const clearCart = () => {
        setCart({ items: [], totalAmount: 0 });
    };

    
    const addToWishList = (product) => {
        setWishlist((prev) => {
            const exists = prev.items.find((item) => item.productID === product.productID);
            if (exists) return prev;
            return { ...prev, items: [...prev.items, product] };
        });
    };

    const removeFromWishList = (productID) => {
        setWishlist((prev) => ({
            ...prev,
            items: prev.items.filter((item) => item.productID !== productID),
        }));
    };

    const clearWishList = () => {
        setWishlist({ items: [] });
    };

    const value = {
        cart,
        wishlist,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        addToWishList,
        removeFromWishList,
        clearWishList,
    };

    return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

export const useStore = () => {
    const context = useContext(StoreContext);
    if (!context) {
        throw new Error("useStore must be used within a StoreProvider");
    }
    return context;
};
