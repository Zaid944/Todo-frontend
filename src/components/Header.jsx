import { Link } from "react-router-dom";
import { useContext } from "react";
import axios from "axios";
import { server, Context } from "../main";
import toast from "react-hot-toast";

const Header = () => {
  const { isAuthenticated, setIsAuthenticated, loading, setLoading } =
    useContext(Context);
  const logoutHandler = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(server + "/users/logout", {
        withCredentials: true,
      });
      toast.success(data.message);
      setIsAuthenticated(false);
      setLoading(false);
    } catch (error) {
      toast.error(error.response.data.message);
      setIsAuthenticated(true);
      setLoading(false);
    }
  };
  return (
    <nav className='header'>
      <div>
        <h2>Todo App</h2>
      </div>
      <article>
        <Link to='/'>Home</Link>
        <Link to='/profile'>Profile</Link>
        {isAuthenticated ? (
          <button disabled={loading} className='btn' onClick={logoutHandler}>
            Logout
          </button>
        ) : (
          <Link to='/login'>Login</Link>
        )}
      </article>
    </nav>
  );
};

export default Header;
