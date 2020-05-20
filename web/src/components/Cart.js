import React, { useEffect } from 'react';
import Head from 'next/head';
import api from '../services/api';
import Link from 'next/link';
import { FaSearchLocation, FaBan } from 'react-icons/fa'
''
import { useUser } from '../context/userContext';
import { useCart } from '../context/cartContext';
import { useOrder } from '../context/orderContext';

import PageLayout from './PageLayout';

export default function Cart() {

    const userContext = useUser();
    const cartContext = useCart();
    const orderContext = useOrder();

    useEffect(() => {
        
        getProducts();

    }, []);

    useEffect(() => {

        if (cartContext.productsState.length > 0) {

            calcTotalPrice();
        }

    }, [cartContext.productsState, cartContext.cart, cartContext.freightSelectedState]);

    useEffect(() => {

        resetFreight();

    }, [cartContext.cepInputState]);

    function resetFreight(){

        cartContext.setFreightSelected(null);
        cartContext.setFreightPrice(0);
    }

    function calcTotalPrice() {

        let totalPrice = 0;

        for (let i = 0; i < cartContext.cart.length; i++) {

            if(cartContext.productsState[i]){

                totalPrice += cartContext.productsState[i].finalPrice * cartContext.cart[i].qtd;
            }
        }

        if(cartContext.freightSelectedState == 'pac') totalPrice += Number((cartContext.freightPriceState.pac.Valor).replace(',', '.'))
        else if(cartContext.freightSelectedState == 'sedex') totalPrice += Number((cartContext.freightPriceState.sedex.Valor).replace(',', '.'))
        
        cartContext.setTotalPrice(totalPrice.toFixed(2));
    }

    async function getProducts() {

        const products = []

        for (let i = 0; i < cartContext.cart.length; i++) {

            try {

                const response = await api.get(`/products/${cartContext.cart[i].id}`);

                const finalPrice = (response.data.discount_percent == 0)
                    ? Number(response.data.price).toFixed(2)
                    : (response.data.price - (response.data.price * (response.data.discount_percent / 100))).toFixed(2);

                products.push({ finalPrice, ...response.data });

                if(cartContext.cart[i].qtd > response.data.quantity_stock){

                    cartContext.cart[i].qtd = response.data.quantity_stock;
                    
                    cartContext.setCart(cartContext.cart);
                }

            } catch (error) {
                console.error(error);
                alert('Erro, recarregue a página');
                break;
            }
        }

        cartContext.setProducts(products);
    }

    function verifyQtd({ id, qtd }) {

        resetFreight();

        const [ product ] = cartContext.productsState.filter((product) => product.id == id);

        const [ cart ] = cartContext.cart.filter((product) => product.id == id);

        if (((cart.qtd + qtd) == (product.quantity_stock + 1)) || ((cart.qtd + qtd) < 1)) {

            qtd = 0;

        } else if ((cart.qtd) > product.quantity_stock) {

            qtd = product.quantity_stock - cart.qtd;
        }

        cartContext.addToCart({ id, qtd });
    }

    function removeFromCart(id) {

        const products = cartContext.productsState.filter((product) => product.id != id);

        cartContext.setProducts(products);
        cartContext.removeFromCart(id);
        resetFreight();
    }

    function handleFreightCheck(name){

        if(name == 'pac'){

            cartContext.setFreightSelected('pac');

        } else if (name == 'sedex'){

            cartContext.setFreightSelected('sedex');
        }
    }

    async function getFreightPrice(){

        let weight = 0;
        let length = 0;
        let height = 0;
        let width = 0;
        let diameter = 0;

        for(let i = 0; i < cartContext.productsState.length; i++) {

            weight += Number((cartContext.productsState[i].weight).replace(',', '.')) * cartContext.cart[i].qtd;
            height += Number(cartContext.productsState[i].height) * cartContext.cart[i].qtd;

            if(length < cartContext.productsState[i].length) length = Number(cartContext.productsState[i].length);
            if(width < cartContext.productsState[i].width) width = Number(cartContext.productsState[i].width);
            if(diameter < cartContext.productsState[i].diameter) diameter = Number(cartContext.productsState[i].diameter);
        }

        weight = String(weight).replace('.', ',');

        try {

            const response = await api.post('/freight', {
                destZipCode: String(cartContext.cepInputState).replace('-', ''),
                weight,
                length,
                height,
                width
            });

            if(response.data.pac.MsgErro) {

                alert(response.data.pac.MsgErro)

            } else if(response.data.sedex.MsgErro){

                alert(response.data.sedex.MsgErro)

            } else {

                cartContext.setFreightPrice(response.data);
            }
            
        } catch (error) {
            console.error(error);
            alert('Erro, tente novamente');
        }
    }

    return (
        <>
            <Head>
                <title>Carrinho de compras</title>
                <meta name="robots" content="noindex" />
            </Head>

            <PageLayout>

                <section>
                    {cartContext.productsState.length == 0 ? (
                        <h1>Carrinho vazio</h1>
                    ) : <h1>Carrinho</h1>}
                    <table>
                        <thead>
                            <tr>
                                <th className='th-image'>Imagem</th>
                                <th className='th-product'>Produto</th>
                                <th className='th-price'>Preço unitário</th>
                                <th className='th-qtd'>Quantidade</th>
                                <th className='th-total'>Preço</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartContext.productsState.length > 0 && cartContext.productsState.map((product, index) => (
                                <tr key={product.id}>
                                    <td className='td-image'>
                                        <img
                                            src='https://i.picsum.photos/id/892/800/400.jpg'
                                            /*src='https://picsum.photos/800/400'*/
                                            /*src={product.images[0] && product.images[0].url} */
                                            alt={'imagem-' + product.name.split(' ').join('-')}
                                        />
                                    </td>
                                    <td className='td-name'>
                                        <Link href='/[productId]/[productName]' as={`/${product.id}/${product.name.split(' ').join('-')}`}>
                                            <a>
                                                <span className='over-hidden'>{product.name}</span>
                                                {(product.discount_percent != 0)
                                                    ? <span className='order-discount'>-{product.discount_percent}%</span>
                                                    : null
                                                }
                                            </a>
                                        </Link>
                                    </td>
                                    <td className='td-price'>
                                        R$ {product.finalPrice}
                                    </td>
                                    <td className='td-qtd'>
                                        <span>
                                            <button
                                                type="button"
                                                id='remove'
                                                onClick={() => removeFromCart(product.id)}
                                                title='Remover do carrinho'
                                            >
                                                X
                                            </button>
                                            <button
                                                type="button"
                                                id='less'
                                                onClick={() => verifyQtd({ id: product.id, qtd: -1 })}
                                                title='Remover 1'
                                            >
                                                -
                                            </button>
                                            <p className='cart-qtd'>{cartContext.cart[index].qtd}</p>
                                            <button
                                                type="button"
                                                id='plus'
                                                onClick={() => verifyQtd({ id: product.id, qtd: 1 })}
                                                title='Adicionar 1'
                                            >
                                                +
                                            </button>
                                        </span>
                                        <span>
                                            Disponível: {product.quantity_stock}
                                        </span>
                                    </td>
                                    <td className='td-total'>
                                        R$ {(product.finalPrice * cartContext.cart[index].qtd).toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    <div className='freight-total'>

                        <div className="calc-freight">
                            <div className='cep-input'>
                                Calculo de frete:&nbsp;<input type='text' placeholder='CEP' value={cartContext.cepInputState} onChange={(event) => cartContext.setCepInput(event.target.value)} />
                                <button 
                                    type='button' 
                                    onClick={() => getFreightPrice()}
                                    disabled={(cartContext.productsState.length == 0 || (cartContext.cepInputState.length != 8 && cartContext.cepInputState.length != 9)) ? true : false}
                                >
                                    <FaSearchLocation size={20} />
                                </button>
                            </div>
                            
                            {cartContext.freightPriceState ? (
                                <div className='choose-freight'>
                                        <span>
                                            <input 
                                                type="radio" 
                                                name='pac'
                                                checked={cartContext.freightSelectedState == 'pac' ? true : false} 
                                                onChange={(event) => handleFreightCheck(event.target.name)} 
                                            /> 
                                            <p>PAC - R$ {cartContext.freightPriceState.pac.Valor} - {cartContext.freightPriceState.pac.PrazoEntrega} Dias</p>
                                        </span>
                                        <span>
                                            <input 
                                                type="radio" 
                                                name='sedex'
                                                checked={cartContext.freightSelectedState == 'sedex' ? true : false} 
                                                onChange={(event) => handleFreightCheck(event.target.name)} 
                                            /> 
                                            <p>SEDEX - R$ {cartContext.freightPriceState.sedex.Valor} - {cartContext.freightPriceState.sedex.PrazoEntrega} Dias</p>  
                                        </span>
                                </div>
                            )
                            : null}
                        </div>

                        <div className="total-price">
                            <p>Total: R$ {cartContext.totalPriceState}</p>
                            
                            {(userContext.login) ? (
                                <button 
                                    type='button'
                                    onClick={() => orderContext.setOrder('address')}
                                    disabled={(cartContext.cart.length == 0) ? true : false }
                                >
                                    {(cartContext.cart.length == 0) ? <FaBan /> : 'Fechar Pedido' }
                                </button>
                            ) : (
                                <button type='button' onClick={userContext.handleSwitchModal}>Fazer Login</button>
                            )}
                        </div>

                    </div>

                </section>

            </PageLayout>

            <style jsx>{`
                section {
                    min-height: 800px;
                    padding: 10px;
                }

                section h1 {
                    text-align: center;
                    margin: 25px 0;
                }

                table {
                    width: 100%;
                    border-spacing: 0 5px;
                }

                .th-image {
                    width: 10%;
                }

                .th-product {
                    width: 45%;
                }

                .th-price, .th-qtd, .th-total  {
                    width: 15%; 
                }

                tbody tr {
                    background: #c9c9c9;
                }

                .td-image {
                    text-align: center;
                    border-top-left-radius: 5px;
                    border-bottom-left-radius: 5px;
                }

                .td-image img {
                    width: auto;
                    height: 50px;
                    vertical-align: middle;
                    padding: 1px 0;
                }

                .td-name .over-hidden {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                }

                .td-name a {
                    display: flex;
                    justify-content: space-between;
                }

                .td-name .order-discount {
                    background: #3E8C34;
                    max-height: 27px;
                    padding: 5px 10px;
                    margin: 0 0 0 10px;
                }

                .td-price {
                    text-align: center;
                }

                .td-qtd .cart-qtd {
                    font-weight: bold;
                    font-size: 20px;
                }

                .td-qtd span {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                .td-qtd span + span {
                    margin: 5px 0 0 0;
                }

                .td-qtd button {
                    width: 20px; 
                    height: 20px;
                    margin: 0 10px;
                    border: 0;
                    border-radius: 2px;
                    font-weight: bold;
                    cursor: pointer;
                }

                .td-qtd button:active {
                    background: #3E8C34;
                }

                .td-qtd button#remove {
                    background: #a32e39;
                }
                
                .td-qtd button#remove:active { 
                    background: #bf2232;
                }

                .td-qtd input {
                    width: 40px;
                }

                .td-total {
                    text-align: center;
                    font-weight: bold;
                    border-top-right-radius: 5px;
                    border-bottom-right-radius: 5px;
                }

                .freight-total {
                    display: flex;
                    justify-content: flex-end;
                }

                .total-price {
                    font-size: 30px;
                    font-weight: bold;
                    margin: 20px 30px 0 0;
                }

                .total-price button {
                    width: 100%;
                    height: 50px;
                    margin: 10px 0 0 0;
                    border: 0;
                    border-radius: 5px;
                    background: ${(userContext.login) ? '#3E8C34' : '#E4E000'};
                    font-size: 20px;
                    font-weight: bold;
                    cursor: pointer;
                }

                .total-price button:hover {
                    background: ${(userContext.login) ? '##41A933' : '#C3C133'};
                }
                
                .total-price button:active {
                    background: ${(userContext.login) ? '#3E8C34' : '#E4E000'};
                }

                .total-price button:disabled {
                    background: #a32e39;
                }

                .calc-freight {
                    margin: 20px 50px 0 0;
                }

                .calc-freight .cep-input {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                .calc-freight input {
                    width: 150px;
                    height: 30px;
                    font-size: 25px;  
                    padding: 0 0 0 2px;  
                    border: 0;
                    border-radius: 5px;
                }

                .calc-freight button {
                    width: 30px;
                    height: 30px;
                    border: 0;
                    border-radius: 5px;
                    margin: 0 0 0 5px;
                    cursor: pointer;
                }

                .calc-freight button:active {
                    background: #3E8C34;
                }

                /* remove arrows from input[type="number"] Chrome, Safari, Edge, Opera */
                input::-webkit-outer-spin-button,
                input::-webkit-inner-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }

                /* remove arrows from input[type="number"] Firefox */
                input[type=number] {
                    -moz-appearance: textfield;
                }

                .choose-freight {
                    margin: 10px 0 0 0;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                }

                .choose-freight span {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                .choose-freight span input {
                    margin: 0 10px 0 0;
                }

                .choose-freight input {
                    width: 20px;
                }

                @media (max-width: 800px) {
                    .th-image, .td-image, .th-total, .td-total {
                        display: none;
                    }
                }
            `}</style>
        </>
    );
}