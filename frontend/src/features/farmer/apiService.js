import axios from 'axios';

// Ensure this matches the port your FastAPI server runs on (typically 8000)
const API_BASE_URL = 'http://localhost:8000';

export const apiService = {
    /**
     * Post a text query directly to your main.py engine.
     * Since the backend relies on file uploads, we convert the text into a tiny text blob file 
     * so it safely matches your backend's UploadFile parameters without changes.
     */
    sendChatMessage: async (
        queryText,
        retailerId,
        activeLanguage
    ) => {

        const response = await axios.post(
            `${API_BASE_URL}/multilingual-relationship-ai`,
            {
                retailer_id: retailerId,
                farmer_question: queryText
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        return response.data;
    },
    /**
     * Upload raw audio recording chunks from the browser to your exact backend file parameter.
     */
    sendVoiceMessage: async (
        audioBlob,
        retailerId,
        activeLanguage
    ) => {

        const formData = new FormData();

        // MUST match FastAPI parameter name
        formData.append(
            'audio',
            audioBlob,
            'voice_query.wav'
        );

        const response = await axios.post(
            `${API_BASE_URL}/vaani-voice-ai`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        return response.data;
    },
    sendCropDiseaseImage: async (imageFile) => {

        const formData = new FormData();

        formData.append(
            'image',
            imageFile
        );

        const response = await axios.post(
            `${API_BASE_URL}/crop-disease-vision`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        return response.data;
    },

};