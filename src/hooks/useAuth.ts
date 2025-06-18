import { ALIASES } from "@/constants/routeAliases";

// Obtiene el token de autenticación
const getToken = () => localStorage.getItem("token");

// Obtiene todas las empresas asociadas al usuario desde localStorage
const getUserCompanies = () => {
  const str = localStorage.getItem("companies");
  return str ? JSON.parse(str) : [];
};

// Verifica si el usuario está autenticado
const isAuthenticated = () => getToken() != null;

// Obtiene los roles del usuario donde la empresa tiene id==null (SU)
const getRolesDeveloper = () => {
  if (!isAuthenticated()) return [];
  let companiesArr = getUserCompanies();
  companiesArr = companiesArr.filter((c: any) => c.id == null);
  return companiesArr.flatMap((c: any) => Array.isArray(c.roles) ? c.roles : []);
}

// Obtiene los roles del usuario donde la empresa tiene id!=null (ADMIN_EMPRESA, SECRETARIA, etc)
const getRolesAdminBusiness = () => {
  if (!isAuthenticated()) return [];
  let companiesArr = getUserCompanies();
  companiesArr = companiesArr.filter((c: any) => c.id != null);
  return companiesArr.flatMap((c: any) => Array.isArray(c.roles) ? c.roles : []);
}

// comprueba si el usuario tiene algun rol a nivel business para el id de la empresa
const userHasBusinessLevelRoleFor = (companyId: number) => {
  if (!isAuthenticated()) return [];
  const companiesArr = getUserCompanies();
  return companiesArr.some((c: any) => c.id != null && c.id == companyId);
};

// Determina la ruta de redirección según el rol principal del usuario
const getRedirectPathForRole = () => {
  if (!isAuthenticated()) return "";
  if (getRolesDeveloper().length > 0)
    return ALIASES.SU.DASHBOARD;
  else if (getRolesAdminBusiness().length > 0) {
    const firstCompany = getUserCompanies()[0];
    return ALIASES.ADMIN.DASHBOARD.replace(":companyId", firstCompany.id);
  }
  return "";
};

export function useAuth() {
  return {
    getRedirectPathForRole,
    getRolesDeveloper,
    getRolesAdminBusiness,
    userHasBusinessLevelRoleFor
  };
}
