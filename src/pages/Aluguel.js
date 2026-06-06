import React, { useState } from 'react';

export default function Aluguel() {
  const [locacoes] = useState([
    { id: 'LOC-1029', cliente: 'João Silva', ferramenta: 'Furadeira de Impacto', retirada: '01/10/2023' },
    { id: 'LOC-1030', cliente: 'Construtora Alfa', ferramenta: 'Betoneira 400L', retirada: '15/09/2023' },
  ]);

  const [modalAberto, setModalAberto] = useState(false);

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
            
            <div className="modal-body">
              <div className="form-group full-width">
                <label>Cliente</label>
                <input type="text" placeholder="Digite o nome do cliente" />
              </div>
              <div className="form-group full-width">
                <label>Ferramenta</label>
                <input type="text" placeholder="Qual ferramenta?" />
              </div>
              <div className="form-group full-width">
                <label>Data de Retirada</label>
                <input type="date" />
              </div>
              <div className="modal-footer full-width" style={{ marginTop: '20px' }}>
                <button className="btn-submit" onClick={() => setModalAberto(false)}>
                  + Confirmar Locação
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}