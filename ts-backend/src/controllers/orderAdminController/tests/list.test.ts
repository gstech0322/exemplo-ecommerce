import supertest from 'supertest';

import typeormConnection from '../../../databases/typeorm/connection';
import sonicConnection from '../../../databases/sonic/connection';
import truncate from '../../../testUtils/truncateTypeorm';
import app from '../../../app';
import UserModel from '../../../models/UserModel';
import AddressModel from '../../../models/AddressModel';
import OrderModel from '../../../models/OrderModel';
import CategoryModel from '../../../models/CategoryModel';
import ProductModel from '../../../models/ProductModel';
import OrderProductModel from '../../../models/OrderProductModel';

const fakeUser = {
    name: "fake user",
    cpf: "61311682023",
    email: "fake@admin.com",
    password: "123456"
}

const fakeAddress = {
    street: 'rua lala',
    number: '11',
    neighborhood: 'bairro haha',
    city: 'kakanopolis',
    state: 'fp',
    zipcode: '73214596024'
}

const fakeOrder = {
    freight_name: 'pac',
    freight_price: 10.50,
    total_price: 30.00,
    payment_method: 'credit_card',
    status: 'paid',
}

const fakeProduct = {
    title: 'fake product',
    description: 'bla bla bla',
    html_body: '<p>vai</p>',
    price: "10.50",
    quantity_stock: 100,
    tangible: true,
    weight: "5",
    length: 15,
    height: 15,
    width: 15,
}

describe('orderAdminController List Test Suit', () => {

    beforeAll( () => {

        return typeormConnection;
    });

    beforeEach( () => {
              
        return truncate();
    });

    afterAll( async () => {

        await sonicConnection.search.close();
        await sonicConnection.ingest.close();

        return (await typeormConnection).close();
    });

    it('it should list all orders', async () => {

        const user =  UserModel.create(fakeUser);
        user.admin = true;
        await user.save();
        const token = user.generateJwt();

        const address =  AddressModel.create({ ...fakeAddress, user_id: user.id });
        await address.save();

        const order1 = OrderModel.create({ 
            ...fakeOrder,
            user_id: user.id, 
            address_id: address.id, 
        });
        await order1.save();

        const order2 = OrderModel.create({ 
            ...fakeOrder,
            user_id: user.id, 
            address_id: address.id, 
        });
        await order2.save();

        const response = await supertest(app).get(`/admin/orders?limit=15&offset=0`)
            .set('authorization', 'Bearer ' + token)
        ;

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('count');
        expect(response.body).toHaveProperty('orders');
        expect(response.body.orders).toHaveLength(2);
    });

    it('it should list all orders, filtered by status and offset', async () => {

        const user =  UserModel.create(fakeUser);
        user.admin = true;
        await user.save();
        const token = user.generateJwt();

        const address =  AddressModel.create({ ...fakeAddress, user_id: user.id });
        await address.save();

        const order1 = OrderModel.create({ 
            ...fakeOrder,
            user_id: user.id, 
            address_id: address.id, 
        });
        await order1.save();

        const order2 = OrderModel.create({ 
            ...fakeOrder,
            user_id: user.id, 
            address_id: address.id, 
        });
        await order2.save();

        const category = CategoryModel.create({
            name: 'teste',
        });
        await category.save();

        const product = ProductModel.create({
            ...fakeProduct,
            category,
        });
        await product.save();

        const orderProduct = OrderProductModel.create({
            order: order1,
            product,
            quantity_buyed: 1,
            product_price: 15,
        });
        await orderProduct.save();

        const response = await supertest(app).get(`/admin/orders?limit=15&offset=1&status=paid`)
            .set('authorization', 'Bearer ' + token)
        ;

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('count');
        expect(response.body).toHaveProperty('orders');
        expect(response.body.orders).toHaveLength(1);
    });
});
