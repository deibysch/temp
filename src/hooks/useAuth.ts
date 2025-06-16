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

  const getRedirectPathForRole = () => {
    // console.log("getRedirectPathForRole",isAuthenticated, rolesByCompany());
    if (!isAuthenticated || !rolesByCompany()) return "";

    if(hasAnyRole("SUPER_USUARIO")) return ALIASES.SU.DASHBOARD;
    else if(hasAnyRole("ADMIN_EMPRESA")) return ALIASES.ADMIN.DASHBOARD;
    return "";
  };

  return { isAuthenticated, hasAnyRole, getRedirectPathForRole };
}
