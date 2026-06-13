import axios from "axios";

const API_BASE = "https://localhost:7131";
// Cria uma "cópia" do axios já configurada com a sua URL base
const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000, // (Opcional) Cancela a requisição se demorar mais de 10 segundos
});

export default api;