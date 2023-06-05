import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../redux/actions/authActions";
import { ClipLoader } from 'react-spinners';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [username , setUsername] = useState('')
    const [password , setPassword] = useState('');
    const { loading } = useSelector(state => state.auth);

    const handleSubmit = e => {
        e.preventDefault();
        const data = { username , password };
        dispatch(login(data , navigate))
    }

    return (
        <section className="h-screen  flex justify-center items-center px-10 ">
            <div className="h-[95%] lg:w-[45%] md:w-[60%] w-full rounded-xl shadow-xl  bg-black  ">
                <header className="py-3 flex justify-center gradient-1 w-full rounded-t-lg border-b-2">
                    <img src="/images/loginlogo.svg" alt="" />
                </header>
                <div className="text-center py-6">
                    <p className="text-2xl font-semibold">Log In to Big Bull</p>
                    <small className="text-gray-500">
                        Enter your username and password below
                    </small>
                </div>
                <form className="p-5" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <label 
                            className="text-primary font-semibold" htmlFor="email"
                            >
                                username
                            </label>
                            <input
                                type="text"
                                className="card-input focus:border-primary"
                                placeholder="Ex : Admin"
                                required
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label 
                            className="text-primary font-semibold" htmlFor="password"
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                className="card-input focus:border-primary"
                                placeholder="admin@gmail.com"
                                required
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="text-end my-3 mr-10 text-primary">
                        <Link to="/email">
                            <small>Forgot Password?</small>
                        </Link>
                    </div>
                    <div className="px-14">
                        <button
                            type="submit"
                            className="text-center gradient-3 border py-3 mt-12 font-semibold rounded-lg w-full disabled:cursor-not-allowed"
                            disabled={loading}
                        >
                            {
                                loading 
                                ? 
                                    <ClipLoader size={20} color='white' />
                                : 
                                    'Login'
                            }
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default Login;
