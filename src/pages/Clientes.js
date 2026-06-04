import React, { useState } from 'react';

export default function Clientes() {
  const [clientes, setClientes] = useState([
    { id: 'CLI-001', nome: 'João Silva', documento: '111.222.333-44', telefone: '(11) 99999-9999', status: 'Ativo' },
    { id: 'CLI-002', nome: 'Construtora Alfa', documento: '12.345.678/0001-99', telefone: '(11) 3333-4444', status: 'Inativo' },
  ]);
  const [busca, setBusca] = useState('');
  const [modalAberto, setModalAberto] = useState(false);

  return (
    <>
      <header className="page-header">
        <div className="logo-container">
          <div className="logo-icon">👥</div>
          <h1>MÓDULO DE CLIENTES</h1>
        </div>
      </header>

      <main className="main-content">
        <div className="actions-bar">
          <div className="filters">
            <input 
              type="text" 
              placeholder="Buscar cliente por nome..." 
              className="input-search"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
            <button className="btn-filter">Filtrar</button>
          </div>
          <button className="btn-add-main" onClick={() => setModalAberto(true)}>
            + Novo Cliente
          </button>
        </div>

        <div className="table-container">
          <table className="estoque-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>NOME / RAZÃO SOCIAL</th>
                <th>CPF / CNPJ</th>
                <th>TELEFONE</th>
                <th style={{textAlign: 'center'}}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map(cli => (
                <tr key={cli.id}>
                  <td>{cli.id}</td>
                  <td>{cli.nome}</td>
                  <td>{cli.documento}</td>
                  <td>{cli.telefone}</td>
                  <td style={{textAlign: 'center'}}>
                    <span className={cli.status === 'Ativo' ? 'badge-normal' : 'badge-danger'} style={{backgroundColor: cli.status === 'Ativo' ? '#d4edda' : '', padding: '5px 10px', borderRadius: '12px'}}>
                      {cli.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Modal - Usa a mesma estrutura do CSS Global */}
      {modalAberto && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Cadastrar Cliente</h2>
              <button className="close-btn" onClick={() => setModalAberto(false)}>X</button>
            </div>
            <div className="modal-body">
              <div className="form-group full-width">
                <label>Nome Completo / Razão Social</label>
                <input type="text" />
              </div>
              <div className="form-group">
                <label>CPF / CNPJ</label>
                <input type="text" />
              </div>
              <div className="form-group">
                <label>Telefone</label>
                <input type="text" />
              </div>
              <div className="modal-footer full-width">
                <button className="btn-submit" onClick={() => setModalAberto(false)}>Salvar Cliente</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}