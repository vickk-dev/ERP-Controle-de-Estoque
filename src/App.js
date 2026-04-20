import { BrowserRouter, Routes, Route } from "react-router-dom";
import Teste from "./pages/Teste";


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