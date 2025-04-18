import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jwtDecode from "jwt-decode";

const AuthProvider = React.createContext();

function AuthProvider(props) {
  const [state, setState] = useState({
    loading: null,
    error: null,
    user: null,
  });
  const navigate = useNavigate();


  // 🐨 Todo: Exercise #4
    //  ให้เขียน Logic ของ Function `login` ตรงนี้
  const login = async () =>  {
      try {
      const result = await axios.post("http://localhost:4000/auth/login", data);
      const token = result.data.token;
      localStorage.setItem("token", token);
      const userDataFromToken = jwtDecode(token);
      setState({ ...state, user: userDataFromToken });
      navigate("/");
      } catch (error) {
      setState({ ...state, error: error.response?.data?.message || "Login failed" });
      }
    };

  const register = async (data) => {
    try {
      await axios.post("http://localhost:4000/auth/register", data);
      navigate("/login");
    } catch (error) {
      setState({ ...state, error: error.response?.data?.message || "Registration failed" });
    }
  };

      // 🐨 Todo: Exercise #7
    //  ให้เขียน Logic ของ Function `logout` ตรงนี้
    //  Function logout ทำหน้าที่ในการลบ JWT Token ออกจาก Local Storage
  const logout = () => {
    // Remove the JWT token from local storage
    localStorage.removeItem("token");

    // Clear the user state
    setState({ ...state, user: null });

    // Redirect the user to the login page
    navigate("/login");
  };

  const isAuthenticated = Boolean(localStorage.getItem("token"));

  return (
    <AuthContext.Provider
      value={{ state, login, logout, register, isAuthenticated }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

// this is a hook that consume AuthContext
const useAuth = () => React.useContext(AuthContext);

export { AuthProvider, useAuth };
