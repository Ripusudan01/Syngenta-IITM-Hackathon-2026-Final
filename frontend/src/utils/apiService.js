import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  // 1. Get basic system landing status
  getHome: async () => {
    const response = await api.get('/');
    return response.data;
  },

  // 2. Trigger ML stockout model training
  trainStockoutModel: async () => {
    const response = await api.get('/train-stockout-model');
    return response.data;
  },

  // 3. Predict Stockout risk (Requires payload body object)
  predictStockout: async (payload) => {
    const response = await api.post('/predict-stockout', payload);
    return response.data;
  },

  // 4. Fetch specific general farmer profiling metrics
  getFarmerProfile: async (retailerId) => {
    const response = await api.get(`/farmer-profile/${retailerId}`);
    return response.data;
  },

  // 5. Get calculated relationship messages for localized channels
  getRelationshipMessage: async (retailerId) => {
    const response = await api.get(`/relationship-message/${retailerId}`);
    return response.data;
  },

  // 6. Get strategic recommendation paths for a retailer area
  getFieldStrategy: async (retailerId) => {
    const response = await api.get(`/field-strategy/${retailerId}`);
    return response.data;
  },

  // 7. Core LLM workspace aggregate summaries
  getLlmSummary: async () => {
    const response = await api.get('/llm-summary');
    return response.data;
  },

  // 8. Trust score profiles per area configuration
  getTrustProfile: async (retailerId) => {
    const response = await api.get(`/trust-profile/${retailerId}`);
    return response.data;
  },

  // 9. Fetch list of critical farmers needing immediate action
  getCriticalFarmers: async () => {
    const response = await api.get('/critical-farmers');
    return response.data;
  },

  // 10. Fetch core executive high-level trust metrics
  getTrustSummary: async () => {
    const response = await api.get('/trust-summary');
    return response.data;
  },

  // 11. Post dynamic chat context or advisory query queries
  askMultilingualAI: async (retailerId, farmerQuestion) => {
    const response = await api.post('/multilingual-relationship-ai', {
      retailer_id: retailerId,
      farmer_question: farmerQuestion
    });
    return response.data;
  },

  getDailyVisitPlan: async () => {

    const response = await axios.get(
      '/daily-visit-plan'
    );

    return response.data;
  },
};

