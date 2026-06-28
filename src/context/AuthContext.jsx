import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [logueado, setLogueado] = useState(false);
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [esSuperAdmin, setEsSuperAdmin] = useState(false);

  const guardarUsuarioActual = (usuario) => {
    setUsuarioActual(usuario);

    if (usuario) {
      localStorage.setItem("usuarioActual", JSON.stringify(usuario));
    }
  };

  const limpiarSesion = () => {
    setLogueado(false);
    setUsuarioActual(null);
    setEsSuperAdmin(false);
    localStorage.removeItem("usuarioActual");
  };

  return (
    <AuthContext.Provider
      value={{
        logueado,
        setLogueado,
        usuarioActual,
        setUsuarioActual: guardarUsuarioActual,
        esSuperAdmin,
        setEsSuperAdmin,
        limpiarSesion,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }

  return context;
}