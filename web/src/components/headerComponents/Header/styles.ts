import styled from 'styled-components';

export const Container = styled.div`

    header {
        height: 100px;
        background: ${props => props.theme.primary};
    }

    div.limit-center {
        width: 100%;
        max-width: 1100px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
    }

    header a {
        width: fit-content;
        height: 90px;
        
        align-self: center;
        cursor: pointer;
    }

    header img {
        max-width: 100%;
        height: 90px;
    }

    div.login-cart {
        display: flex;
        justify-content: space-between;
        width: 100%;
        max-width: 250px;
    }

    div.login {
        width: 100%;
    }

    .dropdown {
        position: relative;
        width: fit-content !important;
    }

    .dropdown span.name {
        width: 150px;
        
        white-space: nowrap;
        overflow: hidden;
    }

    .dropdown-content {
        display: none;
        position: absolute;
        background-color: #eee;
        color: #111;
        min-width: 160px;   
        z-index: 10;
        top: 22px;
    }

    .dropdown:hover .dropdown-content {
        display: block;
    }

    .dropdown-content p {
        padding: 5px;
        display: flex;
        align-items: center;
        font-weight: normal;
    }

    .dropdown-content p:hover {
        background: #ddd;
    }

    button.login-button, .dropdown {
        width: 100px;
        height: 20px;
        margin: 70px 0 0 0;
        border: 0;
        background: transparent;
        font-size: 20px;
        font-weight: bold;
        cursor: pointer;
        color: ${props => props.theme.color};

        display: flex;
        align-items: center;
    }
    
    li.user-name {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }

    div.icon {
        margin: 35px 10px 0 0;
        text-align: center;
    }

    div.cart-number {
        position: absolute;
        margin: 0 0 0 40px;
        background: ${props => props.theme.danger};
        padding: 1px 5px;
        border-radius: 20px;
        z-index: 20;
    }

    div.cart-number p {
        padding: 0;
        margin: 0;
    }

    @media (max-width: 650px) {
        div.login-cart {
            justify-content: flex-end;
        }

        div.login-cart div.login {
            display: none;
        }
    }

    @media (max-width: 425px) {

        div.login-cart {
            max-width: 175px;
        }
        /*div.limit-center {
            justify-content: flex-start;
        }

        div.limit-center div.login-cart{
            margin-left: 50px;
        }

        div.login-cart {

        }*/
    }
`;
