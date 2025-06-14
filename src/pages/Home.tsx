import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Clock, Users } from "lucide-react"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { ALIASES } from "@/constants/routeAliases"

export default function Home() {
  const companies = [
    {
      name: "FitZone Gym",
      category: "Gimnasio",
      discount: "25% OFF",
      description: "Membresía mensual",
      rating: 4.8,
      location: "Centro",
    },
    {
      name: "Farmacia Salud+",
      category: "Farmacia",
      discount: "15% OFF",
      description: "Medicamentos y vitaminas",
      rating: 4.9,
      location: "Múltiples ubicaciones",
    },
    {
      name: "Restaurante El Sabor",
      category: "Restaurante",
      discount: "20% OFF",
      description: "Comida tradicional",
      rating: 4.7,
      location: "Zona Rosa",
    },
    {
      name: "Parque Aventura",
      category: "Entretenimiento",
      discount: "30% OFF",
      description: "Entrada familiar",
      rating: 4.6,
      location: "Norte",
    },
    {
      name: "Academia TechPro",
      category: "Educación",
      discount: "40% OFF",
      description: "Cursos de programación",
      rating: 4.9,
      location: "Online",
    },
    {
      name: "Café Central",
      category: "Cafetería",
      discount: "10% OFF",
      description: "Bebidas y postres",
      rating: 4.5,
      location: "Centro",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b bg-background w-full">
        <div className="w-full px-4 py-4 flex justify-between items-center">
          <div className="flex items-center flex-shrink-0">
            <div className="relative h-8 w-auto">
              <img
                src="/images/ahorraya-logo-horizontal.png"
                alt="AhorraYa Logo"
                className="h-8 w-auto object-contain"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <Link to={ALIASES.LOGIN}>
              <Button variant="outline" size="sm" className="text-xs px-3">
                Iniciar Sesión
              </Button>
            </Link>
            <Link to={ALIASES.REGISTER}>
              <Button size="sm" className="bg-green-500 hover:bg-green-600 text-xs px-3">
                Registrarse
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-background to-green-50 dark:to-green-950 w-full">
        <div className="w-full px-4 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 px-2">
            Ahorra más de lo que pagas, <span className="text-green-500">cada mes</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-6 md:mb-8 max-w-3xl mx-auto px-4">
            Bienvenido a la app que transforma tu manera de ahorrar.
          </p>
          <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8 max-w-3xl mx-auto px-4">
            Por solo <span className="font-bold text-green-600 text-lg md:text-xl">$9.99</span> al mes, accede a
            descuentos exclusivos con una amplia red de empresas afiliadas: tiendas, restaurantes, servicios, y mucho
            más.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4 px-4">
            <Link to={ALIASES.REGISTER}>
              <Button size="lg" className="bg-green-500 hover:bg-green-600 w-full sm:w-auto">
                Empieza a ahorrar ahora
              </Button>
            </Link>
            <a href="#companies">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Ver empresas afiliadas
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Companies Section */}
      <section id="companies" className="py-16 bg-background w-full">
        <div className="w-full px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Empresas Afiliadas</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Descubre los increíbles descuentos que puedes obtener en tus lugares favoritos
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto">
            {companies.map((company, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                    >
                      {company.category}
                    </Badge>
                    <Badge className="bg-green-500 text-white font-bold">{company.discount}</Badge>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{company.name}</h3>
                  <p className="text-muted-foreground mb-3">{company.description}</p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{company.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{company.location}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <p className="text-muted-foreground mb-4">¡Y muchas empresas más se suman cada semana!</p>
            <Badge variant="outline" className="text-green-600 border-green-600">
              <Users className="h-4 w-4 mr-1" />
              +150 empresas afiliadas
            </Badge>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-muted/50 w-full">
        <div className="w-full px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            {/* Why Pay Section */}
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-6 flex items-center justify-center gap-3">
                <span className="text-2xl">✅</span>
                ¿Por qué pagar una suscripción?
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Porque te devuelve más de lo que inviertes. Con solo usar uno o dos descuentos, ya recuperas el valor
                mensual de la app… <span className="font-bold text-green-600">¡y sigues ahorrando!</span>
              </p>
            </div>

            {/* What You Get Section */}
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-8 flex items-center justify-center gap-3">
                <span className="text-2xl">🔥</span>
                ¿Qué obtienes?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                  <CardContent className="pt-6 text-left">
                    <h3 className="text-xl font-bold mb-3">Descuentos reales</h3>
                    <p className="text-muted-foreground">en empresas seleccionadas.</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-left">
                    <h3 className="text-xl font-bold mb-3">Beneficios exclusivos</h3>
                    <p className="text-muted-foreground">solo para suscriptores.</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-left">
                    <h3 className="text-xl font-bold mb-3">Acceso anticipado</h3>
                    <p className="text-muted-foreground">a promociones especiales.</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-left">
                    <h3 className="text-xl font-bold mb-3">App intuitiva</h3>
                    <p className="text-muted-foreground">fácil, rápida y pensada para ayudarte a gastar menos.</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Who Is It For Section */}
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-6 flex items-center justify-center gap-3">
                <span className="text-2xl">💼</span>
                ¿Para quién es?
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Para personas prácticas e inteligentes que quieren sacarle el máximo provecho a su dinero todos los
                meses.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-background w-full">
        <div className="w-full px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto text-center">
            <div>
              <div className="text-3xl font-bold text-green-500 mb-2">$2,500</div>
              <p className="text-muted-foreground">Ahorro promedio anual por usuario</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-500 mb-2">150+</div>
              <p className="text-muted-foreground">Empresas afiliadas</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-500 mb-2">50K+</div>
              <p className="text-muted-foreground">Usuarios activos</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-500 text-white w-full">
        <div className="w-full px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Por un pequeño monto mensual, empieza a ahorrar de verdad</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Descarga la app y únete a la comunidad que ya está gastando menos.
          </p>
          <div className="space-y-4">
            <Link to={ALIASES.REGISTER}>
              <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                Comenzar ahora por $9.99/mes
              </Button>
            </Link>
            <div className="flex items-center justify-center gap-4 text-sm opacity-90">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Cancela cuando quieras</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4" />
                <span>Sin compromisos</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 md:py-8 bg-muted border-t mt-auto w-full">
        <div className="w-full px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center">
              <div className="relative h-6 md:h-8 w-auto">
                <img
                  src="/images/ahorraya-logo-horizontal.png"
                  alt="AhorraYa Logo"
                  className="h-6 md:h-8 w-auto object-contain"
                />
              </div>
            </div>
            <div className="text-xs md:text-sm text-muted-foreground text-center">
              © {new Date().getFullYear()} AhorraYa. Todos los derechos reservados.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
