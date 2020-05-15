import React, { createContext, useContext, useState, useEffect } from 'react';

const Context = createContext({});

export function CartContextProvider({ children }){

    const [cartState, setCart] = useState([]);

    useEffect( () => {
        
        const storedCart = JSON.parse(localStorage.getItem('cart'));

        if(storedCart) setCart(storedCart);

    }, [])

    function addToCart(newProduct){

        let cart = [];
        let findIt = false;

        if(cartState.length > 0){
            
            cartState.forEach( (product) => {
    
                if(newProduct.id == product.id){
                        
                    newProduct.qtd = Number(newProduct.qtd) + Number(product.qtd);
    
                    findIt = true;
                    cart.push(newProduct);
    
                } else {
    
                    cart.push(product);
                } 
            });

            if(!findIt) cart.push(newProduct);

        } else {

            cart.push(newProduct);
        }
           
        localStorage.setItem('cart', JSON.stringify(cart));
        setCart(cart);
    }

    return (
        <Context.Provider value={{ cart: cartState, addToCart }}>
            {children}
        </Context.Provider>
    );
}

export function useCart(){

    const context = useContext(Context);

    return context;
}