import { BrowserRouter, Routes, Route } from "react-router-dom";
import Teste from "./pages/pedidos";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Teste />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;