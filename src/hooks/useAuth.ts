import { useMemo } from "react";
import { ALIASES } from "@/constants/routeAliases";


export function useAuth() {
  const token = ()=>localStorage.getItem("token");
  const roles = ()=>localStorage.getItem("roles");

  const isAuthenticated = useMemo(() => !!token, [token]);

  const hasAnyRole = useMemo(
    () => (roleOrRoles: string) => {
        if (!isAuthenticated || !roles()) return false;
      let parsedRoles = JSON.parse(roles());
      let requiredRoles = roleOrRoles.split(",").map((r) => r.trim());

      return requiredRoles.some((r) => parsedRoles.includes(r));
    },
    [roles()]
  );

  const getRedirectPathForRole = () => {
    if (!isAuthenticated || !roles()) return "";
    let parsedRoles = JSON.parse(roles());

    if (parsedRoles.includes("su")) return ALIASES.SU.DASHBOARD;
    else if (parsedRoles.includes("writer")) return ALIASES.HOME;
    return "";
  };

  return { isAuthenticated, hasAnyRole, getRedirectPathForRole };
}
