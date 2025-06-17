import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User } from '@/types/user';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User as UserIcon, Settings, LogOut } from 'lucide-react';
import { logout } from '@/pages/auth/authApi'
import { ALIASES } from "@/constants/routeAliases"

interface UserAvatarProps {
  user: User;
}

export function UserAvatar({ user }: UserAvatarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  // Obtener empresas del usuario desde localStorage (nueva estructura)
  const companiesStr = localStorage.getItem("companies");
  let companies: { id: string; name: string; photo_url: string; roles: string[] }[] = [];
  if (companiesStr) {
    companies = JSON.parse(companiesStr);
  }

  // Detectar empresa seleccionada según la URL
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);

  useEffect(() => {
    // Buscar el companyId en la url tipo /business/:companyId/...
    const match = location.pathname.match(/\/business\/(\d+)/);
    if (match) {
      const companyId = match[1];
      const exists = companies.some(c => String(c.id) === companyId);
      if (exists) {
        setSelectedCompanyId(companyId);
        return;
      }
    }
    // Si no hay match o no existe, seleccionar la primera (en caso SU)
    if (companies.length > 0) {
      setSelectedCompanyId(String(companies[0].id));
    }
  }, [location.pathname, companiesStr]);

  const handleLogout = async () => {
    setOpen(false);
    try {
      await logout();
    } catch (e) {
      
    }
    navigate(ALIASES.LOGIN);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className="relative h-10 w-10 rounded-full ring-offset-background transition-all hover:ring-2 hover:ring-ring hover:ring-offset-2"
          aria-label="User menu"
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.url_thumbnail || "/placeholder.svg"} alt={user.name} />
            <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none truncate" title={user.name}>{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <div className="px-2 py-1 text-xs text-muted-foreground">Empresas</div>
        {companies.map(company => (
          <DropdownMenuItem
            key={company.id}
            onClick={() => {
              navigate(ALIASES.ADMIN.DASHBOARD.replace(":companyId", company.id));
              setOpen(false);
            }}
            className={selectedCompanyId === String(company.id) ? "bg-emerald-100 dark:bg-emerald-900/30" : ""}
          >
            {company.photo_url && (
              <img
                src={company.photo_url}
                alt={company.name}
                className="w-5 h-5 rounded-full mr-2 object-cover"
              />
            )}
            <span className="truncate" title={company.name}>{company.name || `Empresa #${company.id}`}</span>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate(ALIASES.PROFILE)}>
          <UserIcon className="mr-2 h-4 w-4" />
          <span>Ver perfil</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate(ALIASES.SU.SETTINGS)}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Ajustes</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-600 focus:text-red-600"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Cerrar sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}