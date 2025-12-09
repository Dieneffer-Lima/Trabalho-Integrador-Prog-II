// frontend/src/api.js

import axios from 'axios';

// Cria uma instância do Axios com a URL base do seu backend
// Baseado na sua imagem de console, o backend está rodando na porta 3001
const api = axios.create({
  baseURL: 'http://localhost:3001/api', // Assumindo que seus endpoints começam com /api
  timeout: 5000, // Limite de 5 segundos para a requisição
});

export default api;