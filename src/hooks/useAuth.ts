import { useMemo } from "react";
import { ALIASES } from "@/constants/routeAliases";


export function useAuth() {
  const token = () => localStorage.getItem("token");
  const rolesByCompany = () => localStorage.getItem("rolesByCompany");

  const isAuthenticated = useMemo(() => !!token, [token]);

  const hasAnyRole = useMemo(
    () => (roleOrRoles: string) => {
      if (!isAuthenticated || !rolesByCompany()) return false;
      let parsedRoles = JSON.parse(rolesByCompany()||"[]");
      let requiredRoles = roleOrRoles.split(",").map((r) => r.trim());

      return requiredRoles.some((r) => {
        // console.log("Verificando rol:", r, "dentro de rolesByCompany:", parsedRoles);
        for (let role in parsedRoles) {
          if (parsedRoles[role].includes(r)) {
            console.log("Role Encontrado:", r);
            return true;
          }
        }
      });
    },
    [rolesByCompany()]
  );

  const getAdminCompanyId = () => {
    // Primero intenta obtenerlo de localStorage
    const stored = localStorage.getItem("adminCompanyId");
    if (stored) return stored;
    // Si no existe, intenta calcularlo desde rolesByCompany
    const rolesStr = rolesByCompany();
    if (!rolesStr) return "";
    const parsed = JSON.parse(rolesStr);
    return Object.keys(parsed).find(cid => parsed[cid].includes("ADMIN_EMPRESA")) || "";
  };

  const getRedirectPathForRole = () => {
    // console.log("getRedirectPathForRole",isAuthenticated, rolesByCompany());
    if (!isAuthenticated || !rolesByCompany()) return "";

    if(hasAnyRole("SUPER_USUARIO")) return ALIASES.SU.DASHBOARD;
    else if(hasAnyRole("ADMIN_EMPRESA")) {
      const companyId = getAdminCompanyId();
      if (companyId) {
        return ALIASES.ADMIN.DASHBOARD.replace(":companyId", companyId);
      }
    }
    return "";
  };

  return { isAuthenticated, hasAnyRole, getRedirectPathForRole, getAdminCompanyId };
}
