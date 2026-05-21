import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export const farmerApi = {

    getFarmerProfile: async (retailerId) => {

        const response = await axios.get(
            `${API_BASE_URL}/farmer-profile/${retailerId}`
        );

        return response.data;
    },

    async getRelationshipMessage(retailerId) {

        const response = await axios.get(
            `${API_BASE_URL}/relationship-message/${retailerId}`
        );

        return response.data;
    },
    async getFieldStrategy(retailerId) {

        const response = await fetch(
            `http://localhost:8000/field-strategy/${retailerId}`
        );

        if (!response.ok) {
            throw new Error("Failed to fetch field strategy");
        }

        return response.json();
    },
    async getNextBestAction(retailer_id) {

        const response = await axios.get(
            `${API_BASE_URL}/next-best-action/${retailer_id}`
        );

        return response.data;
    },
};

