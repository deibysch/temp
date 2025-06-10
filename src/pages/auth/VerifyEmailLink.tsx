import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { verifyEmailLink } from "./authApi";

export default function VerifyEmail() {
  const { id, hash } = useParams();
  const [status, setStatus] = useState<"loading" | "success" | "already" | "error">("loading");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function verify() {
      try {
        const data = await verifyEmailLink(id as string, hash as string, window.location.search);
        setMessage(data.message || "Correo verificado correctamente.");
        setStatus(data.message?.includes("ya fue verificado") ? "already" : "success");
      } catch (error: any) {
        setMessage(error.message);
        setStatus("error");
      }
    }
    verify();
  }, [id, hash]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-950">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        {status === "loading" && (
          <>
            <Loader2 className="h-10 w-10 mx-auto animate-spin text-blue-600" />
            <p className="mt-4 text-gray-700 dark:text-gray-300">Verificando tu correo...</p>
          </>
        )}
        {status === "success" && (
          <>
            <CheckCircle className="h-10 w-10 mx-auto text-green-600" />
            <h2 className="mt-4 text-2xl font-bold text-green-700 dark:text-green-400">¡Correo verificado!</h2>
            <p className="mt-2 text-gray-700 dark:text-gray-300">{message}</p>
            <button
              className="mt-6 px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
              onClick={() => navigate("/login")}
            >
              Ir a iniciar sesión
            </button>
          </>
        )}
        {status === "already" && (
          <>
            <CheckCircle className="h-10 w-10 mx-auto text-green-600" />
            <h2 className="mt-4 text-2xl font-bold text-green-700 dark:text-green-400">Correo ya verificado</h2>
            <p className="mt-2 text-gray-700 dark:text-gray-300">{message}</p>
            <button
              className="mt-6 px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
              onClick={() => navigate("/login")}
            >
              Ir a iniciar sesión
            </button>
          </>
        )}
        {status === "error" && (
          <>
            <AlertCircle className="h-10 w-10 mx-auto text-red-600" />
            <h2 className="mt-4 text-2xl font-bold text-red-700 dark:text-red-400">Error</h2>
            <p className="mt-2 text-gray-700 dark:text-gray-300">{message}</p>
            <button
              className="mt-6 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              onClick={() => navigate("/")}
            >
              Ir al inicio
            </button>
          </>
        )}
      </div>
    </div>
  );
}
