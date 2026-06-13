import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Importando o Axios

const API_BASE = process.env.REACT_APP_API_URL || "https://localhost:7123"; // Porta do seu C#

export default function ControleEstoque() {
  // 1. O Estado começa VAZIO. Os dados reais virão do back-end.
  const [estoque, setEstoque] = useState([]);
  const [busca, setBusca] = useState('');
  const [filtroMarca, setFiltroMarca] = useState('');
  const [modalAberto, setModalAberto] = useState(false);
  const [novoItem, setNovoItem] = useState({ nome: '', marca: '', precoDia: '', quantidade: '' });

  // 2. BUSCAR DADOS DO BACKEND (GET) quando a tela abre
  useEffect(() => {
    async function carregarEstoque() {
      try {
        const res = await axios.get(`${API_BASE}/api/v1/estoque`);
        
        // O Axios já converte para JSON automaticamente dentro de "res.data"
        setEstoque(res.data);
        
      } catch (error) {
        console.error("Erro ao buscar estoque (CORS ou Servidor desligado):", error);
      }
    }
    
    carregarEstoque();
  }, []); // <-- Array vazio para rodar apenas 1 vez ao abrir a tela

  // 3. SALVAR DADOS NO BACKEND (POST)
  const handleCadastrar = async (e) => {
    e.preventDefault();
    
    // Adaptação de Dados para o C#
    const quantidade = parseInt(novoItem.quantidade) || 0;
    const patrimoniosGerados = [];
    for (let i = 0; i < quantidade; i++) {
        patrimoniosGerados.push(`PAT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`);
    }

    // O Payload espelha o CadastroCatalogoDto do backend
    const payload = {
      nomeModelo: novoItem.nome,
      categoria: novoItem.marca, 
      precoDia: parseFloat(novoItem.precoDia) || 0,
      precoHora: 0, 
      patrimonios: patrimoniosGerados
    };

    try {
      // POST com Axios enviando o payload diretamente
      const response = await axios.post(`${API_BASE}/api/v1/estoque/catalogo`, payload, {
        headers: { 
          'Content-Type': 'application/json'
        }
      });

      const resultado = response.data; 
      
      // Atualização Visual Rápida na Tabela
      const itemParaTela = {
          // Usamos o primeiro Guid retornado como Key (ou um ID aleatório caso a API não retorne)
          id: resultado?.idsGerados ? resultado.idsGerados[0] : Math.random().toString(), 
          nome: novoItem.nome,
          marca: novoItem.marca,
          estoque: quantidade,
          precoDia: payload.precoDia
      };

      setEstoque([...estoque, itemParaTela]);
      setNovoItem({ nome: '', marca: '', precoDia: '', quantidade: '' });
      setModalAberto(false);

    } catch (error) {
       console.error("Erro crítico de CORS ou Rede:", error);
       
       // Se o backend C# enviar uma mensagem de erro na resposta (ex: BadRequest), o Axios captura assim:
       const mensagemErro = error.response?.data ? JSON.stringify(error.response.data) : "Servidor desligado ou erro de CORS.";
       alert("O Backend rejeitou a requisição: " + mensagemErro);
    }
  };

  const itensFiltrados = estoque.filter(item =>
    item.nome?.toLowerCase().includes(busca.toLowerCase()) &&
    item.marca?.toLowerCase().includes(filtroMarca.toLowerCase())
  );

  return (
    <div className="app-container">
      <main className="main-content" style={{ marginTop: '80px', padding: '0 20px' }}>
        <h2 style={{ color: '#1a2a5e', marginBottom: '20px' }}>CONTROLE DE ESTOQUE</h2>
        
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
                  {/* Se o ID for um Guid gigante do C#, usamos substring(0,8) para ficar visualmente limpo */}
                  <td>{item.id?.substring(0,8)}...</td>
                  <td>{item.nome}</td>
                  <td>{item.marca}</td>
                  <td style={{textAlign: 'center'}}>
                    <span className={item.estoque <= 5 ? 'badge-danger' : 'badge-normal'}>
                      {item.estoque}
                    </span>
                  </td>
                </tr>
              ))}
              {itensFiltrados.length === 0 && (
                <tr>
                    <td colSpan="4" style={{textAlign: 'center', padding: '20px'}}>Nenhuma ferramenta encontrada no estoque.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

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
                <input type="number" required min="1" value={novoItem.quantidade} onChange={(e) => setNovoItem({...novoItem, quantidade: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Preço por Dia (R$)</label>
                <input type="number" step="0.01" required min="0" value={novoItem.precoDia} onChange={(e) => setNovoItem({...novoItem, precoDia: e.target.value})} />
              </div>
              <div className="modal-footer full-width">
                <button type="submit" className="btn-submit" disabled={!novoItem.nome || !novoItem.marca || !novoItem.quantidade || !novoItem.precoDia}>
                  + Adicionar item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}