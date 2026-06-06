import React, { useState, useEffect } from 'react';

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([
    // Dados temporários enquanto o back-end não está linkado
    { id: 'PED-551', cliente: 'Carlos Andrade', valor: 'R$ 150,00', status: 'Alugado' },
    { id: 'PED-552', cliente: 'Construtora Alfa', valor: 'R$ 3.200,00', status: 'Devolvido' },
  ]);

  /* 
  // COMO VAI FICAR QUANDO LIGAR O BACK-END:
  useEffect(() => {
    fetch('URL_DO_SEU_BACKEND/pedidos')
      .then(res => res.json())
      .then(data => setPedidos(data));
  }, []);
  */

  const handleDarBaixa = async (idPedido) => {
    /*
    // 1. O FRONT AVISA O BACK-END QUE FOI DEVOLVIDO:
    await fetch(`URL_DO_SEU_BACKEND/pedidos/${idPedido}/devolver`, { method: 'PUT' });
    // O seu back-end automaticamente vai devolver a quantidade para o estoque lá no banco de dados.
    */

    // 2. ATUALIZAÇÃO VISUAL NO FRONT (para funcionar agora sem o back):
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
                    {/* Muda a cor dependendo se está Alugado ou Devolvido */}
                    <span style={{ color: ped.status === 'Devolvido' ? 'green' : 'orange', fontWeight: 'bold' }}>
                      {ped.status}
                    </span>
                  </td>
                  <td style={{textAlign: 'center'}}>
                    {/* Só mostra o botão se o status for "Alugado" */}
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