import { useNavigate } from "react-router-dom";
 
export function Logout() {
  const navigate = useNavigate();
 
  function logout() {
    localStorage.removeItem("@ERP_Ferramentas:token");
 
    navigate("/login", { replace: true });
  }
 
  return { logout };
}