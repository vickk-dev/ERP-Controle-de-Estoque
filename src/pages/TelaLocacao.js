import React, { useState, useEffect, useMemo } from 'react';
import { Search, Barcode, Calendar, Truck, Tag, DollarSign, CheckCircle, Trash2, Loader2 } from 'lucide-react';

export default function TelaLocacao() {

  const [buscaCliente, setBuscaCliente] = useState('');
  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [loadingCliente, setLoadingCliente] = useState(false);
  const [mostrarAutocomplete, setMostrarAutocomplete] = useState(false);

  const [codigoPatrimonio, setCodigoPatrimonio] = useState('');
  const [ferramentaSelecionada, setFerramentaSelecionada] = useState(null);
  const [loadingFerramenta, setLoadingFerramenta] = useState(false);
  const [erroFerramenta, setErroFerramenta] = useState('');

  const [dataDevolucao, setDataDevolucao] = useState('');
  const [valorFrete, setValorFrete] = useState(0);
  const [valorDesconto, setValorDesconto] = useState(0);
  const [enviandoContrato, setEnviandoContrato] = useState(false);
  const [sucessoMsg, setSucessoMsg] = useState('');


  // --- EFEITO: BUSCA ASSÍNCRONA DE CLIENTES ---
  useEffect(() => {
    if (buscaCliente.trim().length < 2 || clienteSelecionado) {
      setClientesFiltrados([]);
      return;
    }

    // --- SIMULAÇÃO TESTE ---
    setLoadingCliente(true);    
    const delayDebounce = setTimeout(async () => {
      try {
        // SIMULAÇÃO DE RETORNO DA API:
        const clientesMock = [
          { id: 1, nome: "Carlos Silva", cpf: "123.456.789-00" },
          { id: 2, nome: "Ana Maria Souza", cpf: "987.654.321-11" }
        ];
        
        const resultado = clientesMock.filter(c => 
          c.nome.toLowerCase().includes(buscaCliente.toLowerCase()) || 
          c.cpf.replace(/\D/g, '').includes(buscaCliente.replace(/\D/g, ''))
        );

        setClientesFiltrados(resultado);
      } catch (error) {
        console.error("Erro ao buscar clientes", error);
      } finally {
        setLoadingCliente(false);
      }
    }, 300);
    

    return () => clearTimeout(delayDebounce);
  }, [buscaCliente, clienteSelecionado]);
  


  // --- FUNÇÃO: BUSCA ASSÍNCRONA DA FERRAMENTA ---
  const handleBuscarFerramenta = async (e) => {
    if (e.key === 'Enter' || e.type === 'blur') {
      const codigo = codigoPatrimonio.trim().toUpperCase();
      if (!codigo) return;

      setLoadingFerramenta(true);
      setErroFerramenta('');

      try {
        await new Promise(resolve => setTimeout(resolve, 400));
        
        const bancoFerramentasMock = {
          'MQ-001': { nome: 'Furadeira de Impacto Bosch', diaria: 45.00, alugada: false },
          'MQ-002': { nome: 'Betoneira 400L CSM', diaria: 120.00, alugada: true },
        };

        const ferramenta = bancoFerramentasMock[codigo];

        if (!ferramenta) {
          setErroFerramenta('Patrimônio não localizado no sistema.');
          setFerramentaSelecionada(null);
        } else if (ferramenta.alugada) {
          setErroFerramenta('Esta máquina já se encontra alugada em outro contrato ativo.');
          setFerramentaSelecionada(null);
        } else {
          setFerramentaSelecionada(ferramenta);
          setErroFerramenta('');
        }
      } catch (error) {
        setErroFerramenta('Erro ao consultar o patrimônio.');
        setFerramentaSelecionada(null);
      } finally {
        setLoadingFerramenta(false);
      }
    }
  };

  // --- CÁLCULO DE DIAS LOCADOS ---
  const diasLocados = useMemo(() => {
    if (!dataDevolucao) return 0;
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const devolucao = new Date(dataDevolucao);
    devolucao.setHours(0, 0, 0, 0);
    const diferencaTempo = devolucao.getTime() - hoje.getTime();
    const diferencaDias = Math.ceil(diferencaTempo / (1000 * 60 * 60 * 24));
    return diferencaDias > 0 ? diferencaDias : 0;
  }, [dataDevolucao]);

  // --- RESUMO FINANCEIRO ---
  const resumoFinanceiro = useMemo(() => {
    const precoBase = ferramentaSelecionada ? ferramentaSelecionada.diaria : 0;
    const subtotalFerramenta = precoBase * diasLocados;
    const bruto = subtotalFerramenta + Number(valorFrete);
    const total = Math.max(0, bruto - Number(valorDesconto));
    return { subtotalFerramenta, total };
  }, [ferramentaSelecionada, diasLocados, valorFrete, valorDesconto]);

  // --- VALIDAÇÃO DO FORMULÁRIO ---
  const formularioValido = useMemo(() => {
    return clienteSelecionado !== null && ferramentaSelecionada !== null && dataDevolucao !== '' && diasLocados > 0 && !enviandoContrato;
  }, [clienteSelecionado, ferramentaSelecionada, dataDevolucao, diasLocados, enviandoContrato]);

  // --- ENVIO DO FORMULÁRIO ---
  const handleConfirmarLocacao = async (e) => {
    e.preventDefault();
    if (!formularioValido) return;
    setEnviandoContrato(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSucessoMsg('Contrato de locação gerado com sucesso!');
      
      setBuscaCliente('');
      setClienteSelecionado(null);
      setCodigoPatrimonio('');
      setFerramentaSelecionada(null);
      setDataDevolucao('');
      setValorFrete(0);
      setValorDesconto(0);
      setErroFerramenta('');
      setTimeout(() => setSucessoMsg(''), 5000);
    } catch (error) {
      alert('Erro ao processar.');
    } finally {
      setEnviandoContrato(false);
    }
  };

  const styles = {
    container: { minHeight: '100vh', backgroundColor: '#ffffff', fontFamily: 'system-ui, sans-serif', padding: '32px 16px' },
    title: { fontSize: '20px', fontWeight: '700', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' },
    mainCard: { maxWidth: '1100px', margin: '0 auto', backgroundColor: '#ffffff', borderRadius: '0 0 12px 12px', padding: '32px', border: '1px solid #e5e7eb', borderTop: 'none'},    blockBox: { backgroundColor: '#f8fcf8', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '24px', position: 'relative', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' },
    blockTitle: { fontSize: '14px', fontWeight: '700', color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 },
    label: { display: 'block', fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '8px' },
    inputWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
    inputIcon: { position: 'absolute', left: '14px', color: '#94a3b8', width: '16px', height: '16px' },
    inputField: { width: '100%', padding: '11px 14px 11px 40px', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', color: '#334155', outline: 'none', transition: 'all 0.2s' },
    autocompleteList: { position: 'absolute', zIndex: 10, width: '100%', marginTop: '4px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', maxHeight: '200px', overflowY: 'auto', listStyle: 'none', padding: 0 },
    autocompleteItem: { padding: '12px 16px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' },
    selectedCard: { backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    toolSelectedCard: { backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', color: '#1e293b', borderRadius: '8px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' },
    financeBox: { backgroundColor: '#f8fcf8', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px' },
    btnSubmit: (valid) => ({ width: '100%', padding: '14px', border: 'none', borderRadius: '8px', fontWeight: '700', textTransform: 'uppercase', fontSize: '13px', letterSpacing: '0.5px', color: '#fff', backgroundColor: valid ? '#10b981' : '#cbd5e1', cursor: valid ? 'pointer' : 'not-allowed', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: valid ? '0 4px 6px -1px rgba(16, 185, 129, 0.2)' : 'none' }),
    successAlert: { backgroundColor: '#f0fdf4', borderLeft: '4px solid #10b981', color: '#166534', padding: '16px', borderRadius: '6px', marginBottom: '24px', display: 'flex', gap: '12px', alignItems: 'center', fontWeight: '600' }
  };

  return (
    <div style={styles.container}>

      <main style={styles.mainCard}>
        {sucessoMsg && (
          <div style={styles.successAlert}>
            <CheckCircle color="#10b981" size={20} />
            <span>{sucessoMsg}</span>
          </div>
        )}

        <form onSubmit={handleConfirmarLocacao} style={{ display: 'flex', flexWrap: 'wrap', gap: '28px' }}>
          
          {/* COLUNA ESQUERDA: ENTRADAS */}
          <div style={{ flex: '2 1 600px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            <div style={styles.blockBox}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={styles.blockTitle}>Identificação do Cliente</h2>
                {loadingCliente && <Loader2 size={14} style={{ animation: 'spin 1s linear infinite', color: '#0A397D' }} />}
              </div>

              {!clienteSelecionado ? (
                <div style={{ position: 'relative' }}>
                  <label style={styles.label}>Buscar por Nome ou CPF</label>
                  <div style={styles.inputWrapper}>
                    <Search style={styles.inputIcon} />
                    <input
                      type="text"
                      style={styles.inputField}
                      placeholder="Ex: Carlos Silva ou 123.456..."
                      value={buscaCliente}
                      onFocus={() => setMostrarAutocomplete(true)}
                      onChange={(e) => setBuscaCliente(e.target.value)}
                    />
                  </div>

                  {mostrarAutocomplete && clientesFiltrados.length > 0 && (
                    <ul style={styles.autocompleteList}>
                      {clientesFiltrados.map((cli) => (
                        <li 
                          key={cli.id} 
                          style={styles.autocompleteItem}
                          onClick={() => { setClienteSelecionado(cli); setMostrarAutocomplete(false); }}
                        >
                          <strong style={{ color: '#334155', fontSize: '14px' }}>{cli.nome}</strong>
                          <span style={{ fontFamily: 'monospace', color: '#64748b', fontSize: '12px' }}>{cli.cpf}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <div style={styles.selectedCard}>
                  <div>
                    <strong style={{ color: '#166534', display: 'block', fontSize: '15px' }}>{clienteSelecionado.nome}</strong>
                    <span style={{ fontSize: '12px', fontFamily: 'monospace', color: '#15803d' }}>CPF: {clienteSelecionado.cpf}</span>
                  </div>
                  <button type="button" style={{ color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '13px', textDecoration: 'underline' }} onClick={() => { setClienteSelecionado(null); setBuscaCliente(''); }}>Alterar</button>
                </div>
              )}
            </div>

            <div style={styles.blockBox}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={styles.blockTitle}>Entrada da Máquina (Limite: 1)</h2>
                {loadingFerramenta && <Loader2 size={14} style={{ animation: 'spin 1s linear infinite', color: '#0A397D' }} />}
              </div>

              {!ferramentaSelecionada ? (
                <div>
                  <label style={styles.label}>Bipar ou Digitar Código do Patrimônio</label>
                  <div style={styles.inputWrapper}>
                    <Barcode style={styles.inputIcon} />
                    <input
                      type="text"
                      style={{ ...styles.inputField, border: erroFerramenta ? '1px solid #f87171' : '1px solid #cbd5e1', textTransform: 'uppercase' }}
                      placeholder="Ex: MQ-001 + ENTER"
                      value={codigoPatrimonio}
                      onChange={(e) => setCodigoPatrimonio(e.target.value)}
                      onKeyDown={handleBuscarFerramenta}
                    />
                  </div>
                  {erroFerramenta && <p style={{ color: '#991b1b', fontSize: '12px', marginTop: '8px', padding: '8px 12px', backgroundColor: '#fef2f2', borderRadius: '6px', border: '1px solid #ffeeee' }}>{erroFerramenta}</p>}
                </div>
              ) : (
                <div style={styles.toolSelectedCard}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
                    <div>
                      <span style={{ fontSize: '10px', backgroundColor: '#0A397D', color: '#ffffff', padding: '3px 8px', borderRadius: '4px', fontWeight: 'bold' }}>ITEM VINCULADO</span>
                      <h3 style={{ margin: '8px 0 4px 0', fontSize: '16px', fontWeight: '700', color: '#1e293b' }}>{ferramentaSelecionada.nome}</h3>
                      <span style={{ color: '#64748b', fontSize: '12px', fontFamily: 'monospace' }}>Patrimônio: {codigoPatrimonio}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>Diária</span>
                      <h3 style={{ color: '#0A397D', margin: 0, fontSize: '20px', fontWeight: '800' }}>R$ {ferramentaSelecionada.diaria.toFixed(2)}</h3>
                    </div>
                  </div>
                  <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', fontStyle: 'italic', color: '#64748b' }}>Entrada travada para este contrato.</span>
                    <button type="button" style={{ backgroundColor: '#ef4444', color: 'white', padding: '6px 12px', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '600' }} onClick={() => { setFerramentaSelecionada(null); setCodigoPatrimonio(''); }}>
                      <Trash2 size={14} /> Limpar
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div style={styles.blockBox}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={styles.blockTitle}>Período de Locação</h2>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'flex-end' }}>
                <div style={{ flex: '1 1 200px' }}>
                  <label style={styles.label}>Data Prevista de Devolução</label>
                  <div style={styles.inputWrapper}>
                    <Calendar style={styles.inputIcon} />
                    <input
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      style={styles.inputField}
                      value={dataDevolucao}
                      onChange={(e) => setDataDevolucao(e.target.value)}
                    />
                  </div>
                </div>
                <div style={{ padding: '11px 16px', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', height: '44px', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flex: '1 1 150px' }}>
                  <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Dias Calculados:</span>
                  <strong style={{ color: '#0A397D', fontFamily: 'monospace', fontSize: '14px' }}>{diasLocados} diárias</strong>
                </div>
              </div>
            </div>

          </div>

          <div style={{ flex: '1 1 350px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            <div style={styles.blockBox}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={styles.blockTitle}>Ajustes Financeiros</h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={styles.label}>Valor do Frete (R$)</label>
                  <div style={styles.inputWrapper}>
                    <Truck style={styles.inputIcon} />
                    <input type="number" min="0" style={styles.inputField} value={valorFrete} onChange={(e) => setValorFrete(e.target.value)} />
                  </div>
                </div>
                <div>
                  <label style={styles.label}>Desconto Especial (R$)</label>
                  <div style={styles.inputWrapper}>
                    <Tag style={styles.inputIcon} />
                    <input type="number" min="0" style={styles.inputField} value={valorDesconto} onChange={(e) => setValorDesconto(e.target.value)} />
                  </div>
                </div>
              </div>
            </div>

            <div style={styles.financeBox}>
              <h3 style={{ ...styles.blockTitle, marginBottom: '16px', color: '#0A397D' }}>Resumo do Contrato</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px', marginBottom: '16px', color: '#475569' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Subtotal Máquina:</span><span style={{ fontWeight: '500' }}>R$ {resumoFinanceiro.subtotalFerramenta.toFixed(2)}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#0284c7' }}><span>Adicional Frete:</span><span>+ R$ {Number(valorFrete).toFixed(2)}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#b91c1c' }}><span>Desconto Aplicado:</span><span>- R$ {Number(valorDesconto).toFixed(2)}</span></div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <strong style={{ color: '#1e293b', fontSize: '14px', letterSpacing: '0.5px' }}>TOTAL:</strong>
                <strong style={{ fontSize: '26px', color: '#0A397D', fontFamily: 'monospace', fontWeight: '800' }}>R$ {resumoFinanceiro.total.toFixed(2)}</strong>
              </div>

              <button type="submit" disabled={!formularioValido} style={styles.btnSubmit(formularioValido)}>
                {enviandoContrato ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <DollarSign size={16} />}
                {enviandoContrato ? 'Processando...' : 'Confirmar Locação'}
              </button>

            </div>

          </div>

        </form>
      </main>
    </div>
  );
}