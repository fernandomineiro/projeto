import { environment } from 'src/environments/environment';

const back_api = environment.api;
const url_api = environment.cloud_image_base;


export const URL_IMG = {
    products: `${url_api}products/`,
    brands: `${url_api}brands/`,
    users: `${url_api}users/`,
    sellers: `${url_api}sellers/`,
    banners: `${url_api}banners/`,
}

export const ROUTERS = {
    login: 'login',
    home: 'home',
    order: "orders",
    profile: "profile",
    password: "password",
    register: "register",
    product_single: 'products-single',
    products: 'products',
    payment: 'payment',
    checkout: 'checkout',
    order_view: 'order/view'
};

export const ENDPOINT = {
    LOGIN: `${back_api}users/login`,
    UPDATE_USERS: `${back_api}users/update`,
    GET_USER: `${back_api}users/findPK`,
    REGISTER_USERS: `${back_api}users/create`,
    USER_UPLOAD: `${back_api}users/uploadImage`,

    BRANDS: `${back_api}brands/getAll`,

    PRODUCTS_BEST_SELLERS: `${back_api}products/best_sellers`,
    PRODUCTS_SELLER: `${back_api}products/sellers`,
    PRODUCTS: `${back_api}products/getAll`,
    PRODUCTS_BY_BRANDS: `${back_api}products/getAllByBrands/`,
    SINGLE_PRODUCT: `${back_api}products/`,

    ORDER_CREATE: `${back_api}orders/create`,
    ORDER_DELETE: `${back_api}orders/delete`,
    ORDER_UPDATE_BY_GROUP: `${back_api}orders/updateGroup`,
    ORDERS_TO_CART: `${back_api}orders/orderToCart`,
    ORDERS_GROUP_BY_ID_GROUPED: `${back_api}payment/getByUserAndGrouped`,
    ORDERS_GROUP_BY_ID_LIST: `${back_api}payment/getByUserGroupIdList`,

    PAYMENT: `${back_api}payment/create`,

    REGION_STATES: `${back_api}regions/getAllStates`,
    REGION_CITIES: `${back_api}regions/getAllCitiesByState`,
    REGION_SELLERS: `${back_api}regions/getAllUsersByCity`,


    BANNERS_ACTIVE: `${back_api}banners/getAllActive`,


    NEWS_ACTIVE: `${back_api}news/getAllActive`,








};