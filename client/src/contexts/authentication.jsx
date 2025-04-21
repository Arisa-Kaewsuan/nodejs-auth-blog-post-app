import axios from "axios";
import { useNavigate } from "react-router-dom";
import { createContext, useContext, useState } from "react";
import { jwtDecode } from 'jwt-decode'


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
      
      const token = res.data.token
      localStorage.setItem("token", token);
      const userDataFromToken = jwtDecode(token);
      setUser( userDataFromToken.username );
      console.log("userDataFromToken", userDataFromToken);  
      console.log("user:", user)
      const message = "Login successfully"
      navigate("/");
      return { message };
    } catch (err) {
      console.error("Login error", err);
      if (err.response) {
        console.error("Response error", err.response.data);
      }
      const message = err.response?.data?.message || "Error fetching data from server";
      return { message };
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
