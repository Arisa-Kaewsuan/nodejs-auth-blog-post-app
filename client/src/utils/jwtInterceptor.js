import axios from "axios";


 // 🐨 Todo: Exercise #6
    //  ให้เขียน Logic ในการแนบ Token เข้าไปใน Header ของ Request
    // เมื่อมีการส่ง Request จาก Client ไปหา Server
    // ภายใน Callback Function axios.interceptors.request.use   

function jwtInterceptor() {
  // Attach the token to the request headers
  axios.interceptors.request.use((req) => {
    const token = localStorage.getItem("token"); // Retrieve the token from localStorage
    if (token) {
      req.headers.Authorization = `Bearer ${token}`; // Attach the token to the Authorization header
    }
    return req;
  });

     // 🐨 Todo: Exercise #6
      //  ให้เขียน Logic ในการรองรับเมื่อ Server ได้ Response กลับมาเป็น Error
      // โดยการ Redirect ผู้ใช้งานไปที่หน้า Login และลบ Token ออกจาก Local Storage
      // ภายใน Error Callback Function ของ axios.interceptors.response.use
  // Handle responses and errors
  axios.interceptors.response.use(
    (response) => {
      return response; // Return the response if successful
    },
    (error) => {
      if (error.response && error.response.status === 401) {
        // Handle unauthorized errors (e.g., token expired)
        localStorage.removeItem("token"); // Remove the token from localStorage
        window.location.href = "/login"; // Redirect to the login page
      }
      return Promise.reject(error); // Reject the promise with the error
    }
  );
}

export default jwtInterceptor;
