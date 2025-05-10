// api/pessoaApi.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export const getPessoas = async () => {
    const response = await axios.get(`${API_URL}/pessoa`);
    return response.data;
};

export const getPessoaById = async (id) => {
    const response = await axios.get(`${API_URL}/pessoa/${id}`);
    return response.data;
};

export const createPessoa = async (pessoaData) => {
    const response = await axios.post(`${API_URL}/pessoa`, pessoaData);
    return response.data;
};

export const updatePessoa = async ({ id, ...pessoaData }) => {
    const response = await axios.put(`${API_URL}/pessoa/${id}`, pessoaData);
    return response.data;
};

export const deletePessoa = async (id) => {
    await axios.delete(`${API_URL}/pessoa/${id}`);
    return id;
};
