import { ALIASES } from "@/constants/routeAliases";


export function useAuth() {
  const token = () => localStorage.getItem("token");
  const companies = () => {
    const str = localStorage.getItem("companies");
    return str ? JSON.parse(str) : [];
  };

  const isAuthenticated = () => token()!=null;

  const hasAnyRole = (roleOrRoles: string) => {
    if (!isAuthenticated()) return false;
    const companiesArr = companies();
    let requiredRoles = roleOrRoles.split(",").map((r) => r.trim());
    return companiesArr.some((company: any) =>
      company.roles && requiredRoles.some((r: string) => company.roles.includes(r))
    );
  };

  const getAdminCompanyId = () => {
    // Primero intenta obtenerlo de localStorage
    const stored = localStorage.getItem("adminCompanyId");
    if (stored) return stored;
    // Si no existe, intenta calcularlo desde companies
    const companiesArr = companies();
    const adminCompany = companiesArr.find((c: any) => c.roles.includes("ADMIN_EMPRESA"));
    return adminCompany && adminCompany.id ? adminCompany.id.toString() : "";
  };

  const getRedirectPathForRole = () => {
    if (!isAuthenticated()) return "";

    if (hasAnyRole("SUPER_USUARIO")) return ALIASES.SU.DASHBOARD;
    else if (hasAnyRole("ADMIN_EMPRESA")) {
      const companyId = getAdminCompanyId();
      if (companyId) {
        return ALIASES.ADMIN.DASHBOARD.replace(":companyId", companyId);
      }
    }
    return "";
  };

  return { isAuthenticated, hasAnyRole, getRedirectPathForRole, getAdminCompanyId };
}
