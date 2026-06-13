import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || "https://localhost:7131";

export default function Aluguel() {
  const [locacoes, setLocacoes] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [novaLocacao, setNovaLocacao] = useState({ cliente: '', ferramenta: '', retirada: '' });

  // === BUSCAR LOCAÇÕES DO BACKEND (GET) ===
  useEffect(() => {
    async function carregarLocacoes() {
      try {
        // Axios faz o GET direto na URL, sem precisar passar headers de token
        const res = await axios.get(`${API_BASE}/api/v1/locacoes`);
        setLocacoes(res.data); 
      } catch (error) {
        console.error("Erro ao buscar locações", error);
      }
    }
    carregarLocacoes();
  }, []); // <-- Array vazio para carregar apenas 1 vez quando a tela abre

  // === CADASTRAR NOVA LOCAÇÃO NO BACKEND (POST) ===
  const handleConfirmarLocacao = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_BASE}/api/v1/locacoes`, novaLocacao, {
        headers: { 
          'Content-Type': 'application/json' // Apenas dizemos que estamos enviando JSON
        }
      });

      const locacaoCriada = response.data; 
      
      setLocacoes([...locacoes, locacaoCriada]); 
      
      setNovaLocacao({ cliente: '', ferramenta: '', retirada: '' });
      setModalAberto(false);
      
    } catch (error) {
       console.error("Erro ao criar locação", error);
       alert("Erro ao salvar locação no backend.");
    }
  };

  return (
    <>
      <main className="main-content" style={{ marginTop: '80px', padding: '0 20px' }}>
        <h2 style={{ color: '#1a2a5e', marginBottom: '20px' }}>MOTOR DE LOCAÇÃO (ALUGUÉIS)</h2>
        
        <div className="actions-bar">
          <div className="filters">
            <input type="text" placeholder="Buscar contrato..." className="input-search" />
            <button className="btn-filter">Buscar</button>
          </div>
          <button className="btn-add-main" onClick={() => setModalAberto(true)}>
            + Nova Locação
          </button>
        </div>

        <div className="table-container">
          <table className="estoque-table">
            <thead>
              <tr>
                <th>CONTRATO</th>
                <th>CLIENTE</th>
                <th>FERRAMENTA</th>
                <th>RETIRADA</th>
              </tr>
            </thead>
            <tbody>
              {locacoes.map(loc => (
                <tr key={loc.id}>
                  <td><strong>{loc.id}</strong></td>
                  <td>{loc.cliente}</td>
                  <td>{loc.ferramenta}</td>
                  <td>{loc.retirada}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {modalAberto && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Nova Locação</h2>
              <button className="close-btn" onClick={() => setModalAberto(false)}>X</button>
            </div>
            
            <form onSubmit={handleConfirmarLocacao} className="modal-body">
              <div className="form-group full-width">
                <label>Cliente</label>
                <input 
                  type="text" 
                  placeholder="Digite o nome do cliente" 
                  required
                  value={novaLocacao.cliente}
                  onChange={(e) => setNovaLocacao({...novaLocacao, cliente: e.target.value})}
                />
              </div>
              <div className="form-group full-width">
                <label>Ferramenta</label>
                <input 
                  type="text" 
                  placeholder="Qual ferramenta?" 
                  required
                  value={novaLocacao.ferramenta}
                  onChange={(e) => setNovaLocacao({...novaLocacao, ferramenta: e.target.value})}
                />
              </div>
              <div className="form-group full-width">
                <label>Data de Retirada</label>
                <input 
                  type="date" 
                  required
                  value={novaLocacao.retirada}
                  onChange={(e) => setNovaLocacao({...novaLocacao, retirada: e.target.value})}
                />
              </div>
              <div className="modal-footer full-width" style={{ marginTop: '20px' }}>
                <button type="submit" className="btn-submit">
                  + Confirmar Locação
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}