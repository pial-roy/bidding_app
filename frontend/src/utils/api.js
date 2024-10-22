const API_BASE_URL = 'http://localhost:8000';

export const API_ENDPOINTS = {
    LOGIN: `${API_BASE_URL}/login/`,
    HOME: `${API_BASE_URL}/home/`,
    REGISTER:`${API_BASE_URL}/register/`,
    PRODUCTS: `${API_BASE_URL}/items/`,
    ITEMS: `${API_BASE_URL}/items/`,
    ITEM: (itemId) => `${API_BASE_URL}/items/${itemId}`,
    BID: `${API_BASE_URL}/bid/`,
    PLACE_BID: (itemId) => `${API_BASE_URL}/items/${itemId}/bid/`,
};