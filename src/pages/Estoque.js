import React, { useState, useEffect } from 'react';

export default function ControleEstoque() {
  const [estoque, setEstoque] = useState([
    { id: 'FER-A1B2', nome: 'Furadeira de Impacto GSB 18V', marca: 'Boasc', estoque: 15, precoDia: 25.0 },
    { id: 'FER-X9C3', nome: 'Martelo Perfurador SDS-Plus D25133', marca: 'Dewalt', estoque: 3, precoDia: 40.0 },
    { id: 'FER-M4N5', nome: 'Serra Circular M5801B', marca: 'Makita', estoque: 8, precoDia: 35.0 },
  ]);

  /*
  // COMO VAI FICAR QUANDO LIGAR O BACK-END:
  // Vai buscar a quantidade de estoque já calculada (Estoque Total - Alugados)
  useEffect(() => {
    fetch('URL_DO_SEU_BACKEND/estoque')
      .then(res => res.json())
      .then(data => setEstoque(data));
  }, []);
  */

  const [busca, setBusca] = useState('');
  const [filtroMarca, setFiltroMarca] = useState('');
  const [modalAberto, setModalAberto] = useState(false);
  const [novoItem, setNovoItem] = useState({ nome: '', marca: '', precoDia: '', quantidade: '' });

  const handleCadastrar = async (e) => {
    e.preventDefault();
    const codigoAleatorio = Math.random().toString(36).substring(2, 6).toUpperCase();
    const idGerado = `FER-${codigoAleatorio}`;
    
    const novo = {
      id: idGerado, 
      nome: novoItem.nome, 
      marca: novoItem.marca,
      estoque: parseInt(novoItem.quantidade) || 0, 
      precoDia: parseFloat(novoItem.precoDia) || 0
    };

    /*
    // EXEMPLO SALVANDO NO BACK-END:
    await fetch('URL_DO_SEU_BACKEND/estoque', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novo)
    });
    */

    setEstoque([...estoque, novo]);
    setNovoItem({ nome: '', marca: '', precoDia: '', quantidade: '' });
    setModalAberto(false);
  };

  const itensFiltrados = estoque.filter(item =>
    item.nome.toLowerCase().includes(busca.toLowerCase()) &&
    item.marca.toLowerCase().includes(filtroMarca.toLowerCase())
  );

  return (
    <div className="app-container">
      <main className="main-content" style={{ marginTop: '80px', padding: '0 20px' }}>
        <h2 style={{ color: '#1a2a5e', marginBottom: '20px' }}>CONTROLE DE ESTOQUE</h2>
        
        <div className="actions-bar">
          <div className="filters">
            <input type="text" placeholder="Pesquisar ferramenta... 🔍" className="input-search" value={busca} onChange={(e) => setBusca(e.target.value)} />
            <input type="text" placeholder="Marca 🔍" className="input-search" value={filtroMarca} onChange={(e) => setFiltroMarca(e.target.value)} />
            <button className="btn-filter">Filtro</button>
          </div>
          <button className="btn-add-main" onClick={() => setModalAberto(true)}>+ Cadastrar Item</button>
        </div>

        <div className="table-container">
          <table className="estoque-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>FERRAMENTAS</th>
                <th>MARCAS</th>
                <th style={{textAlign: 'center'}}>ESTOQUE DISPONÍVEL</th>
              </tr>
            </thead>
            <tbody>
              {itensFiltrados.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.nome}</td>
                  <td>{item.marca}</td>
                  <td style={{textAlign: 'center'}}>
                    {/* Apenas exibe a quantidade que o back-end informou */}
                    <span className={item.estoque <= 5 ? 'badge-danger' : 'badge-normal'}>
                      {item.estoque}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Modal permanece exatamente igual ao seu original */}
      {modalAberto && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Cadastro de Item</h2>
              <button className="close-btn" onClick={() => setModalAberto(false)}>X</button>
            </div>
            <form onSubmit={handleCadastrar} className="modal-body">
              <div className="form-group full-width">
                <label>Nome da Ferramenta</label>
                <input type="text" required value={novoItem.nome} onChange={(e) => setNovoItem({...novoItem, nome: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Marca</label>
                <input type="text" required value={novoItem.marca} onChange={(e) => setNovoItem({...novoItem, marca: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Quantidade Inicial</label>
                <input type="number" required value={novoItem.quantidade} onChange={(e) => setNovoItem({...novoItem, quantidade: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Preço por Dia (R$)</label>
                <input type="number" step="0.01" required value={novoItem.precoDia} onChange={(e) => setNovoItem({...novoItem, precoDia: e.target.value})} />
              </div>
              <div className="modal-footer full-width">
                <button type="submit" className="btn-submit">+ Adicionar item</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}