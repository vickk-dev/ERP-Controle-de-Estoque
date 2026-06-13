import React, { useState, useEffect } from 'react';
import { useAuth } from "./AuthContext";

const API_BASE = process.env.REACT_APP_API_URL || "https://localhost:7131";

export default function Pedidos() {
  const { token } = useAuth();
  const [pedidos, setPedidos] = useState([
    { id: 'PED-551', cliente: 'Carlos Andrade', valor: 'R$ 150,00', status: 'Alugado' },
    { id: 'PED-552', cliente: 'Construtora Alfa', valor: 'R$ 3.200,00', status: 'Devolvido' },
  ]);

   // === BUSCAR PEDIDOS DO BACKEND ===
  useEffect(() => {
    async function carregarPedidos() {
      try {
        const res = await fetch(`${API_BASE}/api/v1/pedidos`, {
          headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
        });
        if(res.ok) {
           const data = await res.json();
           setPedidos(data);
        }
      } catch (error) {
        console.error("Erro ao buscar pedidos", error);
      }
    }
    carregarPedidos();
  }, [token]);
  

  const handleDarBaixa = async (idPedido) => {
    
    // === ENVIAR BAIXA PARA O BACKEND ===
    try {
      const response = await fetch(`${API_BASE}/api/v1/pedidos/${idPedido}/devolver`, { 
        method: 'PUT', // ou PATCH
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
      });

      if (response.ok) {
        // Atualiza a tela se o back confirmar
        const pedidosAtualizados = pedidos.map(ped => {
          if (ped.id === idPedido) return { ...ped, status: 'Devolvido' };
          return ped;
        });
        setPedidos(pedidosAtualizados);
      }
    } catch (error) {
       console.error("Erro ao dar baixa", error);
    }
    

    // ATUALIZAÇÃO VISUAL PROVISÓRIA (remover depois de ligar o back)
    const pedidosAtualizados = pedidos.map(ped => {
      if (ped.id === idPedido) {
        return { ...ped, status: 'Devolvido' };
      }
      return ped;
    });
    setPedidos(pedidosAtualizados);
  };

  return (
    <>
      <main className="main-content" style={{ marginTop: '80px', padding: '0 20px' }}>
        {/* Restante do JSX visual intacto... */}
        <h2 style={{ color: '#1a2a5e', marginBottom: '20px' }}>BAIXA DE PEDIDOS (DEVOLUÇÕES)</h2>
        
        <div className="actions-bar">
          <div className="filters">
            <input type="text" placeholder="Número do Pedido..." className="input-search" />
            <button className="btn-filter">Filtrar</button>
          </div>
        </div>

        <div className="table-container">
          <table className="estoque-table">
            <thead>
              <tr>
                <th>PEDIDO</th>
                <th>CLIENTE</th>
                <th>VALOR TOTAL</th>
                <th>STATUS</th>
                <th style={{textAlign: 'center'}}>AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map(ped => (
                <tr key={ped.id}>
                  <td><strong>{ped.id}</strong></td>
                  <td>{ped.cliente}</td>
                  <td>{ped.valor}</td>
                  <td>
                    <span style={{ color: ped.status === 'Devolvido' ? 'green' : 'orange', fontWeight: 'bold' }}>
                      {ped.status}
                    </span>
                  </td>
                  <td style={{textAlign: 'center'}}>
                    {ped.status === 'Alugado' && (
                      <button 
                        className="btn-add-main" 
                        style={{ padding: '6px 12px', fontSize: '12px', cursor: 'pointer' }}
                        onClick={() => handleDarBaixa(ped.id)}
                      >
                        Dar Baixa (Devolver)
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}