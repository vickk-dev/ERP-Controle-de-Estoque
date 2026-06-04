import React, { useState } from 'react';

export default function Aluguel() {
  const [locacoes] = useState([
    { id: 'LOC-1029', cliente: 'João Silva', ferramenta: 'Furadeira de Impacto', retirada: '01/10/2023', devolucao: '10/10/2023', status: 'Em andamento' },
    { id: 'LOC-1030', cliente: 'Construtora Alfa', ferramenta: 'Betoneira 400L', retirada: '15/09/2023', devolucao: '15/10/2023', status: 'Atrasado' },
  ]);

  // 1. Criamos a variável que controla se a telinha está aberta ou fechada
  const [modalAberto, setModalAberto] = useState(false);

  return (
    <>
      <header className="page-header">
        <div className="logo-container">
          <div className="logo-icon">📅</div>
          <h1>MOTOR DE LOCAÇÃO (ALUGUÉIS)</h1>
        </div>
      </header>

      <main className="main-content">
        <div className="actions-bar">
          <div className="filters">
            <input type="text" placeholder="Buscar contrato..." className="input-search" />
            <button className="btn-filter">Buscar</button>
          </div>
          {/* 2. Adicionamos o evento onClick para abrir o Modal quando clicar */}
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
                <th>DEVOLUÇÃO</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {locacoes.map(loc => (
                <tr key={loc.id}>
                  <td><strong>{loc.id}</strong></td>
                  <td>{loc.cliente}</td>
                  <td>{loc.ferramenta}</td>
                  <td>{loc.retirada}</td>
                  <td>{loc.devolucao}</td>
                  <td>
                    <span className={loc.status === 'Atrasado' ? 'badge-danger' : 'badge-normal'} style={{backgroundColor: loc.status === 'Em andamento' ? '#cce5ff' : '', padding: '5px 10px', borderRadius: '12px'}}>
                      {loc.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* 3. A estrutura do Modal de Locação colocada no final */}
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

              <div style={{ display: 'flex', gap: '15px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Data de Retirada</label>
                  <input type="date" />
                </div>
                
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Data de Devolução</label>
                  <input type="date" />
                </div>
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