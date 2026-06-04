import React from 'react';

export default function Relatorios() {
  return (
    <>
      <header className="page-header">
        <div className="logo-container">
          <div className="logo-icon">📊</div>
          <h1>DASHBOARD GERENCIAL</h1>
        </div>
      </header>

      <main className="main-content">
        {/* Cards do Dashboard */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
          
          <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', borderLeft: '5px solid #FFD700' }}>
            <h3 style={{ color: '#666', fontSize: '14px', marginBottom: '10px' }}>FATURAMENTO MENSAL</h3>
            <h2 style={{ color: '#003366', fontSize: '28px' }}>R$ 15.450,00</h2>
          </div>

          <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', borderLeft: '5px solid #28a745' }}>
            <h3 style={{ color: '#666', fontSize: '14px', marginBottom: '10px' }}>LOCAÇÕES ATIVAS</h3>
            <h2 style={{ color: '#003366', fontSize: '28px' }}>42</h2>
          </div>

          <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', borderLeft: '5px solid #FF4444' }}>
            <h3 style={{ color: '#666', fontSize: '14px', marginBottom: '10px' }}>INADIMPLÊNCIA</h3>
            <h2 style={{ color: '#003366', fontSize: '28px' }}>R$ 1.200,00</h2>
          </div>

        </div>

        {/* Tabela Resumo */}
        <div className="table-container">
          <div style={{ padding: '20px', backgroundColor: '#003366', color: 'white' }}>
            <h3 style={{ margin: 0 }}>Últimas Movimentações (Relatório)</h3>
          </div>
          <table className="estoque-table">
            <thead>
              <tr>
                <th>DATA</th>
                <th>TIPO</th>
                <th>DESCRIÇÃO</th>
                <th>VALOR</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>01/10/2023</td>
                <td><span style={{color: 'green', fontWeight: 'bold'}}>Receita</span></td>
                <td>Pagamento Pedido PED-552</td>
                <td>+ R$ 3.200,00</td>
              </tr>
              <tr>
                <td>02/10/2023</td>
                <td><span style={{color: 'red', fontWeight: 'bold'}}>Despesa</span></td>
                <td>Manutenção Ferramenta Makita</td>
                <td>- R$ 150,00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}