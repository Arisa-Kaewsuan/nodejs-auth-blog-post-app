import React, { useState } from "react";
import axios from "axios";

const AuthContext = React.createContext();

function AuthProvider(props) {
  const [state, setState] = useState({
    loading: null,
    error: null,
    user: null,
  });

  const login = async (username, password) => {
    // 🐨 Todo: Exercise #4
    //  ให้เขียน Logic ของ Function `login` ตรงนี้
    //  Function `login` ทำหน้าที่สร้าง Request ไปที่ API POST /login
    //  ที่สร้างไว้ด้านบนพร้อมกับ Body ที่กำหนดไว้ในตารางที่ออกแบบไว้
    await axios
      .post("http://localhost:4000/auth/login", {
        username: username,
        password: password,
      })
      .then((response) => {
        localStorage.setItem("token", response.data.token);
        setState({ ...state, loading: false, user: response.data.user });
      })
      .catch((error) => {
        console.error("Login failed:", error);
        setState({
          ...state,
          loading: false,
          error: error.response.data.message,
        });
      });
  };

  const register = async (username, password) => {
    // 🐨 Todo: Exercise #2
    //  ให้เขียน Logic ของ Function `register` ตรงนี้
    //  Function register ทำหน้าที่สร้าง Request ไปที่ API POST /register
    //  ที่สร้างไว้ด้านบนพร้อมกับ Body ที่กำหนดไว้ในตารางที่ออกแบบไว้
    setState({ ...state, loading: true, error: null });
    try {
      const response = await axios.post("http://localhost:4000/auth/register", {
        username,
        password,
      });
      localStorage.setItem("token", response.data.token);
      setState({ loading: false, error: null, user: response.data.user });
    } catch (error) {
      console.error("Register failed:", error);
      setState({
        ...state,
        loading: false,
        error: error.response?.data?.message || "Registration failed",
      });
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setState({ loading: false, error: null, user: null });
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
