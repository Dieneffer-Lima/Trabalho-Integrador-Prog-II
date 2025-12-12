// frontend/src/main.jsx 

// Importa React (necessário para JSX)
import React from "react";
// Importa ReactDOM para renderizar o React dentro do HTML 
import ReactDOM from "react-dom/client";
// Importa o componente principal da aplicação
import App from "./App.jsx";
// Importa CSS global do projeto
import "./styles/global.css";

// Importa CSS adicional da pasta pages 
import "./pages/index.css";

// Cria a raiz React dentro da div com id="root" no arquivo index.html
ReactDOM.createRoot(document.getElementById("root")).render(
  // StrictMode ajuda a identificar problemas comuns em desenvolvimento
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
