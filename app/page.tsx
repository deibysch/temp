import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="relative h-10 w-10 mr-2">
              <Image src="/images/logo-ancho.png" alt="AhorraYa Logo" fill className="object-contain" />
            </div>
            {/* <span className="text-2xl font-bold text-green-500">AhorraYa2</span> */}
          </div>
          <div className="space-x-2">
            <Link href="/login">
              <Button variant="outline">Iniciar Sesión</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-green-500 hover:bg-green-600">Registrarse</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-b from-background to-green-50 dark:to-green-950">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Ahorra más de lo que pagas, <span className="text-green-500">cada mes</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Bienvenido a la app que transforma tu manera de ahorrar. Por solo{" "}
            <span className="font-bold text-green-600">$9.99</span> al mes, accede a descuentos exclusivos con una
            amplia red de empresas afiliadas: tiendas, restaurantes, servicios, y mucho más.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="bg-green-500 hover:bg-green-600">
                Comenzar Ahora
              </Button>
            </Link>
            <Link href="#benefits">
              <Button size="lg" variant="outline">
                Conocer Más
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-16">
        <div className="container mx-auto px-4">
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

      {/* CTA Section */}
      <section className="py-16 bg-green-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Por un pequeño monto mensual, empieza a ahorrar de verdad.</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Descarga la app y únete a la comunidad que ya está gastando menos.
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary">
              Descargar la app
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-muted border-t mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="relative h-8 w-8 mr-2">
                <Image src="/images/ahorraya-logo.png" alt="AhorraYa Logo" fill className="object-contain" />
              </div>
              <span className="text-xl font-bold text-green-500">AhorraYa</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} AhorraYa. Todos los derechos reservados.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
