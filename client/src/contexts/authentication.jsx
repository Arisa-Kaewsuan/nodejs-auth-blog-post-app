import axios from "axios";
import { useNavigate } from "react-router-dom";
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
   
  const register = async (data) => {
    await axios.post("http://localhost:4000/auth/register", data);
    navigate("/login");
  };

  const login = async (username, password) => {
    try {
      const res = await axios.post("http://localhost:4000/auth/login", {
        username,
        password,
      });
      
      const data = await res.data;

      localStorage.setItem("token", data.token);
      setUser({ username });
      return { success: true };
  
    } catch (err) {
      console.error("Login error", err);
      const message = err.response?.data?.message || "Error fetching data from server";

      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
