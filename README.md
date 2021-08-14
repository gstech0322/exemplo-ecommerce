# Protótipo de um e-commerce
<strong>Backend</strong>: REST API feita com Express.js, banco de dados Postgres utilizando o ORM Sequelize.</br>
<strong>Frontend (web)</strong>: Feita com React.js utilizando o framework Next.js para gerar páginas estáticas (SSG) dos produtos com meta tags para maximizar a indexação de motores de busca (SEO).</br>
<strong>Painel de Controle (web-admin)</strong>: Também ReactJS com o framework Next.js, área acessivel apenas para administradores gerenciarem produtos, categorias e ordens de compra.

## Backend
- Validação de dados recebidos pelas rotas (headers, params, body e query) com o pacote [Celebrate](https://github.com/arb/celebrate), para garantir que os dados são do tipo correto;
- Rotas para cadastro, atualização e remoção de usuários, endereços, categorias, produtos, upload de imagens de produtos e ordens de compra;
- Rota para autenticação de usuário com JWT (Json Web Token);
- Conexão Web Socket com [Socket.io](https://github.com/socketio/socket.io) para acompanhamento das ordens de compra em tempo real no painel de controle;
- Integração com a API dos Correios para calculo de frete;
- Integração com [Sonic](https://github.com/valeriansaliou/sonic), para buscas com relevância de titulos de produtos;
- Background Jobs com [Bull](https://github.com/OptimalBits/bull) e [Redis](https://github.com/redis/redis) para gerenciar a fila de envio de emails;
- Integração com a API de pagamentos [Pagar.me](https://pagar.me/), para pagamentos com cartão de crédito e boleto.
- Testes unitários com Jest.

## Frontend
- Menu dropdown de categorias de produtos, montada automaticamente a partir das categorias cadastradas no banco de dados;
- Busca recursiva de produtos cadastrados nas categorias filhas;
- Barra de busca pelo nome do produto;
- Paginação na página de busca, com filtros de menor e maior valor;
- Card do produto, mostrando imagem, nome, preço, "em falta", porcentagem de desconto e preço após desconto;
- Página do produto exibindo um slider das imagens cadastradas, breadcrumb da árvore de categoria, nome, desconto, preço, quantidade a comprar, quantidade em estoque, dados de peso e medida, descrição e detalhes do produto;
- Contagem regressiva quando o produto está em promoção, no card e na página;
- Carrinho de compra, mostrando preço total, botões para aumentar e diminuir quantidade ou remover do carrinho e calcular o frete;
- Página para seleção do endereço de entrega, podendo cadastrar um novo endereço ou apagar um já cadastrado (podendo ter vários endereços cadastrados por usuário);
- Tela de confirmação de compra, no caso de boleto exibe link para boleto;
- Tela da conta do usuário, onde ele pode alterar suas informações de cadastro (nome, email, CPF e senha), adicionar ou remover endereços e visualizar suas ordens de compra.
- Testes unitários com React Testing Library.

<p align="center">
  <img src="https://github.com/bruzt/exemplo-ecommerce/blob/master/ecommerce1.gif?raw=true">
</p>

## Para testar

Se você deseja testar esse app você precisa ter o [node.js 14 LTS](https://nodejs.org/) instalado no seu PC e então instalar os pacotes com o comando ``` npm install ``` nos diretórios backend e web, iniciar um banco de dados postgres com [Docker](https://www.docker.com/):

```
sudo docker run -d \
    --name postgres-dev \
    -e POSTGRES_USER=dbuser \
    -e POSTGRES_PASSWORD=F83ai8qD \
    -e POSTGRES_DB=ecommerce-dev \
    -p 5432:5432 \
    postgres:13.3
```

E [Sonic](https://github.com/valeriansaliou/sonic):

```
sudo docker run -d \
    -e AUTH_PASSWORD=a8uY3TgP \
    -p 1491:1491 \
    --name sonic-dev \
    bruzt/sonic-env:v1.3.0
```

E o [Redis](https://github.com/redis/redis):

```
sudo docker run -d \
    -p 6379:6379 \
    --name redis-dev \
    redis:6.2.4
```

No diretório backend, execute as migrations para criar as tabelas no banco de dados com o comando ``` npx sequelize db:migrate ``` e inicie a API com o comando ``` npm run dev ```, depois, no diretório web, execute o comando ``` npm start ``` para iniciar a aplicação, acesse no navegador o endereço ``` http://localhost:3000 ``` e você deve ver a página inicial sem nenhum produto.

### Painel de controle

Para adicionar um produto você pode iniciar o painel de controle do loja, entre no diretório web-admin e instale os pacotes com ``` npm install ``` e o inicie com o comando ``` npm start ```, depois acesse no navegador o endereço ``` http://localhost:3002 ```. Para acessar o painel você precisará criar um usuário administrador, acesse o banco com uma GUI client como o [Postbird](https://github.com/Paxa/postbird) (para Postgres), acesse o banco de dados usando as credenciais:
```
Host: localhost
Port: 5432
Username: dbuser
Password: F83ai8qD
Database: ecommerce-dev
```
Clique em "connect", você pode cadastrar o usuário na interface da loja como um usuário comum e depois, no Postbird, ir na tabela de ``` users ```, clicar na aba "Content" e alterar o campo "admin" de ``` false ``` para ``` true ```, depois disso faça o login no admin-web e você poderá adicionar/alterar/remover categorias e produtos da loja.

<!-- 
VocCom o REST Client [Insomnia](https://insomnia.rest/), importe o workspace do projeto (o arquivo está na raiz desse projeto: "Insomnia_workspace.json"), execute a rota "session" (login) para te retornar uma JWT (JSON Web Token) para acessar as rotas, configure a Bearer token com o JWT na rota "store" de "categories" e "products", crie uma categoria de produto e depois um produto cadastrado ao id daquela categoria, recarregando a página web o card do produto deve aparecer.
-->


