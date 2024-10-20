import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPen } from '@fortawesome/free-solid-svg-icons';

function Home() {
    const [todos, setTodos] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [newTodo, setNewTodo] = useState("");
    const [editingTodoId, setEditingTodoId] = useState(null);
    const [editedText, setEditedText] = useState("");
    const [filter, setFilter] = useState("ALL");
    const [isProfileMenuVisible, setProfileMenuVisible] = useState(false);
    const [username, setUsername] = useState(''); // State to store the user's username
    const [useremail, setUseremail] = useState(''); // State to store the user's email

    const toggleProfileMenu = () => {
        setProfileMenuVisible(!isProfileMenuVisible);
    };

    const navigateTo = useNavigate();

    //useEffect() hook is used for show any effect or changes as per our states
    useEffect(() => {
        const fetchTodosAndUser = async () => {
            const token = localStorage.getItem("jwt");

            if (!token) {
                toast.error("Not authenticated");
                navigateTo("/login");
                return;
            }

            try {
                setLoading(true);

                // Fetch user's todos
                const todosResponse = await axios.get("http://localhost:4002/todo/fetch", {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });

                // Fetch user details
                const userResponse = await axios.get("http://localhost:4002/user/details", {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });

                setTodos(todosResponse.data.todos);
                setUsername(userResponse.data.username); // Store the username from the response
                setUseremail(userResponse.data.email); // Store the  useremail from the response
                setError(null);
            } catch (err) {
                setError("Failed to fetch Todos or User");
                console.log('Fetch Todos/User Error:', err);
            } finally {
                setLoading(false);
            }
        };

        //call the above function
        fetchTodosAndUser();


    }, [navigateTo]);

    const createTodo = async () => {
        if (!newTodo) return;
        try {
            const token = localStorage.getItem("jwt");
            const response = await axios.post("http://localhost:4002/todo/create", {
                text: newTodo,
                completed: false
            }, {
                withCredentials: true,
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            setTodos([...todos, response.data.newTodo]);
            setNewTodo("");
        } catch (err) {
            setError("Failed to create Todo");
            console.log('Create Todo Error:', err);
        }
    };

    const todoStatus = async (id) => {
        const todo = todos.find((t) => t._id === id);
        try {
            const token = localStorage.getItem("jwt");
            const response = await axios.put(`http://localhost:4002/todo/update/${id}`, {
                ...todo,
                completed: !todo.completed
            }, {
                withCredentials: true,
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            setTodos(todos.map((t) => t._id === id ? response.data.result : t));
        } catch (err) {
            setError("Failed to update Todo status");
            console.log('Update Todo Status Error:', err);
        }
    };

    const deleteTodo = async (id) => {
        try {
            const token = localStorage.getItem("jwt");
            await axios.delete(`http://localhost:4002/todo/delete/${id}`, {
                withCredentials: true,
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            setTodos(todos.filter((t) => t._id !== id));
        } catch (err) {
            setError("Failed to delete Todo");
            console.log('Delete Todo Error:', err);
        }
    };

    // ---- Edit todos ----
    const editTodo = async (id) => {
        if (!editedText) return;
        try {
            const token = localStorage.getItem("jwt");
            const response = await axios.put(`http://localhost:4002/todo/edit/${id}`, {
                text: editedText,
                completed: false
            }, {
                withCredentials: true,
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            setTodos(todos.map((todo) => (todo._id === id ? response.data.result : todo)));
            setEditingTodoId(null);
            setEditedText("");
        } catch (err) {
            setError("Failed to update Todo");
            console.log('Update Todo Error:', err);
        }
    };

    const handleKeyPress = (event, id) => {
        if (event.key === "Enter") {
            editTodo(id);
        }
    };

    // Filter todos based on the selected filter
    const filteredTodos = todos.filter(todo => {
        if (filter === "ALL") return true;
        if (filter === "ACTIVE") return !todo.completed;
        if (filter === "COMPLETED") return todo.completed;
        return true;
    });

    // Remaining todos count
    const remainingTodo = todos.filter((todo) => !todo.completed).length;

    return (
        <div className="flex flex-col min-h-screen">
            {/* Main content section */}
            <div className="flex-grow">
                <nav className="p-3 flex bg-blue-600 justify-between items-center">
                    <a href="#" className="flex items-center gap-2 ml-10">
                        <p className='text-3xl font-semibold font-lemon text-center text-white select-none'>
                            <span className="animate-bounce inline-block">
                                <FontAwesomeIcon icon={faPen} />
                            </span> TodoMate
                        </p>
                    </a>

                    {/* Profile Icon (Clickable with username's first letter) */}
                    <div
                        className='mr-10 cursor-pointer rounded-full bg-white flex justify-center items-center w-12 h-12'
                        onClick={toggleProfileMenu}
                    >
                        <p className='text-2xl font-semibold text-center text-gray-800 select-none'>
                            {username.charAt(0).toUpperCase()} {/* Display first letter of username */}
                        </p>
                    </div>

                    {/* Profile menu */}
                    {isProfileMenuVisible && (
                        <div className='absolute right-12 top-20 bg-gray-50 rounded-lg shadow-md mx-8 sm:mx-auto mt-1 w-64 p-4'>
                            <div className='flex-col'>
                                <p className='p-2 font-semibold text-xl'>Hello, <span>{username}</span></p>
                                <p className='p-2 font-semibold text-sm'>{useremail}</p>
                                <div className='flex flex-col mt-3 gap-3'>
                                    <button className="bg-blue-600 border rounded-r-md text-white px-4 py-2 hover:bg-blue-900 duration-300">
                                        Change Password
                                    </button>
                                    <button
                                        onClick={() => {
                                            const result = confirm("Do you want to Logout?");
                                            if (result) {
                                                localStorage.removeItem("jwt");
                                                navigateTo("/login");
                                                toast.success("Logout successfully");
                                            }
                                        }}
                                        className="bg-red-400 border rounded-r-md text-white px-4 py-2 hover:bg-red-600 duration-300"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </nav>

                {/* Todo create container */}
                <div className=" bg-white max-w-lg lg:max-w-xl rounded-lg shadow-lg mx-8 sm:mx-auto p-6 mt-10 mb-20 duration-300">

                    {/* Input for adding a new todo */}
                    <div className='flex mb-4'>
                        <input
                            value={newTodo}
                            onChange={(e) => setNewTodo(e.target.value)}
                            type="text"
                            placeholder="Add a new todo"
                            className="flex-grow p-2 rounded-l-md border focus:outline-none focus:ring-2 focus:ring-blue-500 duration-200"
                        />
                        <button
                            onClick={createTodo}
                            className='bg-blue-600 border rounded-r-md text-white px-4 py-2 hover:bg-blue-900 duration-300 ml-1'>
                            Add
                        </button>
                    </div>

                    {/* Filter button */}
                    <div className='flex mt-2 w-max'>
                        <ul className='flex justify-evenly'>
                            <li
                                className={`p-3 cursor-pointer hover:bg-gray-200 duration-300 select-none ${filter === "ALL" ? "underline font-bold text-blue-500" : "text-gray-500 font-semibold"}`}
                                onClick={() => setFilter("ALL")}
                            >
                                <a className='text-xs'>ALL</a>
                            </li>
                            <li
                                className={`p-3 cursor-pointer hover:bg-gray-200 duration-300 select-none ${filter === "ACTIVE" ? "underline font-bold text-blue-500" : "text-gray-500 font-semibold"}`}
                                onClick={() => setFilter("ACTIVE")}
                            >
                                <a className='text-xs'>ACTIVE</a>
                            </li>
                            <li
                                className={`p-3 cursor-pointer hover:bg-gray-200 duration-300 select-none ${filter === "COMPLETED" ? "underline font-bold text-blue-500" : "text-gray-500 font-semibold"}`}
                                onClick={() => setFilter("COMPLETED")}
                            >
                                <a className='text-xs'>COMPLETED</a>
                            </li>
                        </ul>
                    </div>

                    {/* Loading, Error, and Todos list */}
                    {loading ? (
                        <div className='text-center justify-center'>
                            <span className='text-gray-500'>Loading...</span>
                        </div>
                    ) : error ? (
                        <div className='text-center justify-center text-red-700 font-semibold'>{error}{navigateTo("/login")} </div>
                    ) : (
                        <ul className='space-y-2 mt-5 duration-300'>
                            {filteredTodos.map((todo) => (
                                <li key={todo._id} className='flex items-center justify-between p-3 bg-gray-100 rounded-md'>
                                    <div className='flex items-center'>
                                        <input
                                            type="checkbox"
                                            checked={todo.completed}
                                            onChange={() => todoStatus(todo._id)}
                                            className='mr-2'
                                        />
                                        {editingTodoId === todo._id ? (
                                            <input
                                                type="text"
                                                value={editedText}
                                                onChange={(e) => setEditedText(e.target.value)}
                                                onKeyPress={(e) => handleKeyPress(e, todo._id)}
                                                className="border border-gray-300 rounded p-1"
                                                placeholder="Edit your todo"
                                            />
                                        ) : (
                                            <span className={`${todo.completed ? "line-through text-gray-800 font-semibold" : ""}`}>
                                                {todo.text}
                                            </span>
                                        )}
                                    </div>
                                    <div className='gap-5 flex'>
                                        <button
                                            onClick={() => {
                                                setEditingTodoId(todo._id);
                                                setEditedText(todo.text);
                                            }}
                                            className='text-blue-400 hover:text-blue-700 duration-300'>
                                            <FontAwesomeIcon icon={faPen} />
                                        </button>
                                        <button
                                            onClick={() => deleteTodo(todo._id)}
                                            className='text-red-400 hover:text-red-700 duration-300'>
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}

                    {/* Remaining todos count */}
                    <p className='mt-4 text-center text-sm text-gray-700'>{remainingTodo} Todo Remaining</p>
                </div>
            </div>

            {/* Footer section */}
            <footer className="bg-black text-white p-4 text-center mt-auto">
                <p>&copy; 2024  <span className="animate-bounce inline-block">
                    <FontAwesomeIcon icon={faPen} />
                </span> TodoMate. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default Home;
