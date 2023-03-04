# Prototype of an e-commerce
<strong>Backend</strong>: REST API made with Express.js, Postgres database using Sequelize ORM.</br>
<strong>Frontend (web)</strong>: Made with React.js using the Next.js framework to generate static pages (SSG) of products with meta tags to maximize search engine indexing (SEO).</br>
<strong>Control Panel (web-admin)</strong>: Also ReactJS with Next.js framework, area accessible only for administrators to manage products, categories and purchase orders.

## Backend
- Validation of data received by routes (headers, params, body and query) with the [Celebrate](https://github.com/arb/celebrate) package, to ensure that the data is of the correct type;
- Routes for registering, updating and removing users, addresses, categories, products, uploading product images and purchase orders;
- Route for user authentication with JWT (Json Web Token);
- Web Socket connection with [Socket.io](https://github.com/socketio/socket.io) for monitoring purchase orders in real time on the control panel;
- Integration with the Correios API for freight calculation;
- Integration with [Sonic](https://github.com/valeriansaliou/sonic), for searches with relevant product titles;
- Background Jobs with [Bull](https://github.com/OptimalBits/bull) and [Redis](https://github.com/redis/redis) to manage the email sending queue;
- Integration with the payment API [Pagar.me](https://pagar.me/), for payments with credit card and boleto.
- Unit tests with Jest.

## Frontend
- Responsive pages;
- Dropdown menu of product categories, assembled automatically from the categories registered in the database;
- Recursive search of registered products in the child categories;
- Search bar by product name;
- Pagination on the search page, with lower and higher value filters;
- Product card, showing image, name, price, "out of stock", discount percentage and price after discount;
- Product page displaying a slider of registered images, breadcrumb from the category tree, name, discount, price, quantity to buy, quantity in stock, weight and measurement data, description and product details;
- Countdown when the product is on sale, on the card and on the page;
- Shopping cart, showing total price, buttons to increase and decrease quantity or remove from cart and calculate shipping;
- Page for selecting the delivery address, being able to register a new address or delete an already registered one (it may have several addresses registered per user);
- Purchase confirmation screen, in the case of a ticket, it displays a link to the ticket;
- User account screen, where he can change his registration information (name, email, CPF and password), add or remove addresses and view his purchase orders.
- Unit testing with React Testing Library.

<p align="center">
  <img src="https://github.com/gstech0322/exemplo-ecommerce/blob/master/ecommerce1.gif?raw=true">
</p>

## To test

If you want to test this app you need to have [node.js 16 LTS](https://nodejs.org/) installed on your PC and then install the packages with the command ``` npm install ``` in the directories " backend" and "web", start a postgres database with [Docker](https://www.docker.com/):

```
sudo docker run -d \
    --name postgres-dev \
    -e POSTGRES_USER=dbuser \
    -e POSTGRES_PASSWORD=F83ai8qD \
    -e POSTGRES_DB=ecommerce-dev \
    -p 5432:5432 \
    postgres:14.1
```

E [Sonic](https://github.com/valeriansaliou/sonic):

```
sudo docker run -d \
    -e AUTH_PASSWORD=a8uY3TgP \
    -p 1491:1491 \
    --name sonic-dev \
    bruzt/sonic-env:v1.3.2
```

E o [Redis](https://github.com/redis/redis):

```
sudo docker run -d \
    -p 6379:6379 \
    --name redis-dev \
    redis:6.2.6
```

In the "backend" directory, run the migrations to create the tables in the database with the command ``` npm run dev:migrate ```, run the seeds to add categories and products in the database with the command ``` npm run dev:seed ``` and start the API with the command ``` npm run dev ```, then, in the "web" directory, run the command ``` npm start ``` to start the application, access in the browser the address ``` http://localhost:3000 ``` and you should see the homepage of the store with products without images (you can add images in the control panel).

### Control Panel

To add or change categories and products you can start the store control panel, enter the "web-admin" directory and install the packages with ``` npm install ``` and start it with the command ``` npm start ```, then access the address ``` http://localhost:3002 ``` in the browser, if you ran the seeds in the backend it added a user with administrator permissions to enter, email: ```test@test .com``` and password: ```123456```.
