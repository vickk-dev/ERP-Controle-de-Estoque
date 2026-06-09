import React, { useState, useEffect } from 'react';
import { useAuth } from "./AuthContext";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8080";

export default function Aluguel() {
  const { token } = useAuth();
  const [locacoes, setLocacoes] = useState([
    { id: 'LOC-1029', cliente: 'João Silva', ferramenta: 'Furadeira de Impacto', retirada: '01/10/2023' },
    { id: 'LOC-1030', cliente: 'Construtora Alfa', ferramenta: 'Betoneira 400L', retirada: '15/09/2023' },
  ]);

  const [modalAberto, setModalAberto] = useState(false);
  
  
  const [novaLocacao, setNovaLocacao] = useState({ cliente: '', ferramenta: '', retirada: '' });

  /*
  // === BUSCAR LOCAÇÕES DO BACKEND ===
  useEffect(() => {
    async function carregarLocacoes() {
      try {
        const res = await fetch(`${API_BASE}/api/v1/locacoes`, {
          headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
        });
        if(res.ok) {
           const data = await res.json();
           setLocacoes(data);
        }
      } catch (error) {
        console.error("Erro ao buscar locações", error);
      }
    }
    carregarLocacoes();
  }, [token]);
  */

  const handleConfirmarLocacao = async (e) => {
    e.preventDefault();

    /*
    // === CADASTRAR NOVA LOCAÇÃO NO BACKEND ===
    try {
      const response = await fetch(`${API_BASE}/api/v1/locacoes`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(novaLocacao)
      });

      if (response.ok) {
        const locacaoCriada = await response.json();
        // setLocacoes([...locacoes, locacaoCriada]);
      }
    } catch (error) {
       console.error("Erro ao criar locação", error);
    }
    */

    // Lógica provisória enquanto não tem backend
    const nova = {
      id: `LOC-${Math.floor(Math.random() * 10000)}`,
      cliente: novaLocacao.cliente,
      ferramenta: novaLocacao.ferramenta,
      // Formata data simples
      retirada: novaLocacao.retirada.split('-').reverse().join('/')
    };
    
    setLocacoes([...locacoes, nova]);
    setNovaLocacao({ cliente: '', ferramenta: '', retirada: '' });
    setModalAberto(false);
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
            
            {/* Transformei em Form para capturar o Submit e adicionamos os Values */}
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