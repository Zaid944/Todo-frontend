import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/Header";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Toaster } from "react-hot-toast";
import { useContext, useEffect } from "react";
import axios from "axios";
import { Context, server } from "./main";
function App() {
  const { isAuthenticated, setUser, setIsAuthenticated, setLoading } =
    useContext(Context);
  useEffect(() => {
    if (isAuthenticated) {
      setLoading(true);
      axios
        .get(`${server}/users/me`, {
          withCredentials: true,
        })
        .then((res) => {
          console.log(res.data.user);
          setUser(res.data.user);
          setIsAuthenticated(true);
          setLoading(false);
        })
        .catch((error) => {
          setUser({});
          setIsAuthenticated(false);
          setLoading(false);
        });
    }
  }, [isAuthenticated]);
  return (
    <Router>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
