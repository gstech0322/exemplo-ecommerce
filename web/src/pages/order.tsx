import React, { useEffect } from 'react';

import { useOrder } from '../contexts/orderContext';

import PageLayout from '../components/PageLayout';
import Cart from '../components/orderComponents/Cart';
import SelectAddress from '../components/orderComponents/SelectAddress';
import PaymentMethod from '../components/orderComponents/PaymentMethod';
import ThanksForBuy from '../components/orderComponents/ThanksForBuy';

export default function Order() {

    const orderContext = useOrder();

    useEffect( () => {
        orderContext.setOrderFlowNumber(1);
    }, []);

    return (
        <>
            <PageLayout>

                {(orderContext.getOrderFlowNumber == 1) && <Cart />}
                {(orderContext.getOrderFlowNumber == 2) && <SelectAddress />}
                {(orderContext.getOrderFlowNumber == 3) && <PaymentMethod />}
                {(orderContext.getOrderFlowNumber == 4) && <ThanksForBuy />}

            </PageLayout>
        </>
    );
}
