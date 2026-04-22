const API_BASE = "/api/v1";

function getToken() {
  return localStorage.getItem("@ERP_Ferramentas:token");
}

export async function fetchContratosAtivos() {
  const res = await fetch(`${API_BASE}/contratos?status=ATIVO`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error("Erro ao carregar contratos.");
  return res.json();
}

export async function patchDevolucao(idContrato) {
  const res = await fetch(`${API_BASE}/contratos/${idContrato}/devolucao`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error("Erro ao registrar devolução.");
  return res.json();
}