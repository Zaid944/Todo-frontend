import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Context, server } from "../main";
import toast from "react-hot-toast";
import TodoItem from "../components/TodoItem";
import { Navigate } from "react-router-dom";
const Home = () => {
  const { isAuthenticated } = useContext(Context);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const updateHandler = async (id) => {
    try {
      const { data } = await axios.put(
        `${server}/task/${id}`,
        {},
        {
          withCredentials: true,
        }
      );
      toast.success(data.message);
      setRefresh((refresh) => !refresh);
    } catch (error) {
      toast.error(error.response.data.mesage);
    }
  };
  const deleteHandler = async (id) => {
    try {
      const { data } = await axios.delete(`${server}/task/${id}`, {
        withCredentials: true,
      });
      toast.success(data.message);
      setRefresh((refresh) => !refresh);
    } catch (error) {
      toast.error(error.response.data.mesage);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${server}/task/new`,
        {
          title,
          description,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setTitle("");
      setDescription("");
      toast.success(data.message);
      setLoading(false);
      setRefresh((refresh) => !refresh);
    } catch (error) {
      toast.error(error.response.data.mesage);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      axios
        .get(`${server}/task/my`, {
          withCredentials: true,
        })
        .then((res) => {
          setTasks(res.data.tasks);
        })
        .catch((e) => {
          toast.error(e.response.data.message);
        });
    }
  }, [isAuthenticated, refresh]);

  if (!isAuthenticated) return <Navigate to={"/login"} />;

  return (
    <div className='container'>
      <div className='login'>
        <section>
          <form onSubmit={submitHandler}>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              type='text'
              placeholder='Title'
              required
            />
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              type='text'
              placeholder='Description'
              required
            />

            <button disabled={loading} type='submit'>
              Add Task
            </button>
          </form>
        </section>
      </div>

      <section className='todosContainer'>
        {tasks.map((i) => (
          <div key={i._id}>
            <TodoItem
              isCompleted={i.isCompleted}
              title={i.title}
              description={i.description}
              updateHandler={updateHandler}
              deleteHandler={deleteHandler}
              id={i._id}
            />
          </div>
        ))}
      </section>
    </div>
  );
};

export default Home;
