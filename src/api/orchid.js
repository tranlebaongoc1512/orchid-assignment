import api from "./api";
export const getOrchidsByCategory = async (categoryId) => {
    const response = await api.get('/orchids', {
        params: { categoryId }
    });
    return response.data;
};