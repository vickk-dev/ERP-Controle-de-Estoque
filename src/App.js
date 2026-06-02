import React, { useState } from 'react';
import './App.css';

export default function ControleEstoque() {
  // Dados iniciais baseados na sua imagem (Já ajustados para o novo formato de ID)
  const [estoque, setEstoque] = useState([
    { id: 'FER-A1B2', nome: 'Furadeira de Impacto GSB 18V', marca: 'Boasc', estoque: 15, precoDia: 25.0 },
    { id: 'FER-X9C3', nome: 'Martelo Perfurador SDS-Plus D25133', marca: 'Dewalt', estoque: 3, precoDia: 40.0 },
    { id: 'FER-M4N5', nome: 'Serra Circular M5801B', marca: 'Makita', estoque: 8, precoDia: 35.0 },
    { id: 'FER-P7Q8', nome: 'Jogo de Chave de Fenda Pro', marca: 'Stanley', estoque: 12, precoDia: 10.0 },
    { id: 'FER-Z2W1', nome: 'Esmerilhadeira Angular DWE4120', marca: 'Dewalt', estoque: 5, precoDia: 45.0 },
  ]);

  const [busca, setBusca] = useState('');
  const [filtroMarca, setFiltroMarca] = useState('');
  const [modalAberto, setModalAberto] = useState(false);

  // Campos do formulário de cadastro
  const [novoItem, setNovoItem] = useState({
    nome: '',
    marca: '',
    precoDia: '',
    quantidade: ''
  });

  const handleCadastrar = (e) => {
    e.preventDefault();
    
    // NOVO GERADOR DE ID: Cria um código como FER-X9A2
    const codigoAleatorio = Math.random().toString(36).substring(2, 6).toUpperCase();
    const idGerado = `FER-${codigoAleatorio}`;
    
    setEstoque([...estoque, {
      id: idGerado,
      nome: novoItem.nome,
      marca: novoItem.marca,
      estoque: parseInt(novoItem.quantidade) || 0,
      precoDia: parseFloat(novoItem.precoDia) || 0
    }]);
    
    // Limpa e fecha o modal
    setNovoItem({ nome: '', marca: '', precoDia: '', quantidade: '' });
    setModalAberto(false);
  };

  const itensFiltrados = estoque.filter(item =>
    item.nome.toLowerCase().includes(busca.toLowerCase()) &&
    item.marca.toLowerCase().includes(filtroMarca.toLowerCase())
  );

  return (
    <div className="app-container">
      {/* Cabeçalho */}
      <header className="header">
        <div className="logo-container">
          <div className="logo-icon">🔧</div>
          <h1>O FERRAMENTEIRO</h1>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="main-content">
        
        {/* Barra de Ações e Filtros */}
        <div className="actions-bar">
          <div className="filters">
            <input 
              type="text" 
              placeholder="Pesquisar ferramenta... 🔍" 
              className="input-search"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
            <input 
              type="text" 
              placeholder="Marca 🔍" 
              className="input-search"
              value={filtroMarca}
              onChange={(e) => setFiltroMarca(e.target.value)}
            />
            <button className="btn-filter">Filtro</button>
          </div>
          
          <button className="btn-add-main" onClick={() => setModalAberto(true)}>
            + Cadastrar Item
          </button>
        </div>

        {/* Tabela de Estoque */}
        <div className="table-container">
          <table className="estoque-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>FERRAMENTAS</th>
                <th>MARCAS</th>
                <th style={{textAlign: 'center'}}>ESTOQUE</th>
              </tr>
            </thead>
            <tbody>
              {itensFiltrados.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.nome}</td>
                  <td>{item.marca}</td>
                  <td style={{textAlign: 'center'}}>
                    {/* Regra de cor para o badge (menos estilo excel, mais moderno) */}
                    <span className={item.estoque <= 5 ? 'badge-danger' : 'badge-normal'}>
                      {item.estoque}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginação Mockada */}
        <div className="pagination">
          <span>Página: </span>
          <span className="page-arrow">{'<'}</span>
          <span className="page-number active">1</span>
          <span className="page-number">2</span>
          <span className="page-number">3</span>
          <span className="page-arrow">{'>'}</span>
        </div>
      </main>

      {/* Pop-up (Modal) de Cadastro */}
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
                <input 
                  type="text" 
                  required
                  value={novoItem.nome}
                  onChange={(e) => setNovoItem({...novoItem, nome: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>Marca</label>
                <input 
                  type="text" 
                  required
                  value={novoItem.marca}
                  onChange={(e) => setNovoItem({...novoItem, marca: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Quantidade</label>
                <input 
                  type="number" 
                  required
                  value={novoItem.quantidade}
                  onChange={(e) => setNovoItem({...novoItem, quantidade: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Preço por Dia (R$)</label>
                <input 
                  type="number" 
                  step="0.01"
                  required
                  value={novoItem.precoDia}
                  onChange={(e) => setNovoItem({...novoItem, precoDia: e.target.value})}
                />
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