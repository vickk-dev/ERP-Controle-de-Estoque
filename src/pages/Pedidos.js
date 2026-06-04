import React, { useState } from 'react';

export default function Pedidos() {
  const [pedidos] = useState([
    { id: 'PED-551', cliente: 'Carlos Andrade', valor: 'R$ 150,00', status: 'Aguardando Pagamento' },
    { id: 'PED-552', cliente: 'Construtora Alfa', valor: 'R$ 3.200,00', status: 'Pago / Baixado' },
  ]);

  return (
    <>
      <header className="page-header">
        <div className="logo-container">
          <div className="logo-icon">💲</div>
          <h1>BAIXA DE PEDIDOS</h1>
        </div>
      </header>

      <main className="main-content">
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
                    <span style={{ color: ped.status.includes('Pago') ? 'green' : 'orange', fontWeight: 'bold' }}>
                      {ped.status}
                    </span>
                  </td>
                  <td style={{textAlign: 'center'}}>
                    {ped.status.includes('Aguardando') && (
                      <button className="btn-add-main" style={{ padding: '6px 12px', fontSize: '12px' }}>Dar Baixa</button>
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