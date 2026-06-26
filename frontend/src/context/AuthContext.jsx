import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api";

const AuthContext = createContext(null);

//////////////////////////////////////////////////
// 🔐 AUTH PROVIDER
//////////////////////////////////////////////////
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  //////////////////////////////////////////////////
  // 🔄 RESTORE SESSION
  //////////////////////////////////////////////////
  useEffect(() => {
    const storedUser = localStorage.getItem("sacco_user");
    const token = localStorage.getItem("sacco_token");

    if (storedUser && token) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        // 🔥 Attach token globally to API
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      } catch (err) {
        console.warn("Corrupted user data, clearing storage");

        localStorage.removeItem("sacco_user");
        localStorage.removeItem("sacco_token");
      }
    }

    setLoading(false);
  }, []);

  //////////////////////////////////////////////////
  // 🔑 LOGIN
  //////////////////////////////////////////////////
  const login = async (email, password) => {
    try {
      const { data } = await api.post("/auth/login", {
        email,
        password,
      });

      if (!data?.token || !data?.user) {
        throw new Error("Invalid server response");
      }

      // 💾 Save session
      localStorage.setItem("sacco_token", data.token);
      localStorage.setItem("sacco_user", JSON.stringify(data.user));

      // 🔥 Attach token to future requests
      api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

      setUser(data.user);

      return data.user;
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error.message ||
        "Login failed";

      console.error("LOGIN ERROR:", message);

      throw new Error(message);
    }
  };

  //////////////////////////////////////////////////
  // 🚪 LOGOUT
  //////////////////////////////////////////////////
  const logout = () => {
    localStorage.removeItem("sacco_token");
    localStorage.removeItem("sacco_user");

    delete api.defaults.headers.common["Authorization"];

    setUser(null);
  };

  //////////////////////////////////////////////////
  // PROVIDER VALUE
  //////////////////////////////////////////////////
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

//////////////////////////////////////////////////
// 🔧 CUSTOM HOOK
//////////////////////////////////////////////////
export const useAuth = () => useContext(AuthContext);