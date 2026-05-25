import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../utils/api";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";
import { toast } from "react-toastify";

export default function Landing({ setIsAuth }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [activeModal, setActiveModal] = useState(null);
    const [formData, setFormData] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const openLoginModal = () => setActiveModal('login');
    const openSignupModal = () => setActiveModal('signup');
    const closeModal = () => setActiveModal(null);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${baseUrl}/api/auth/login`, formData);
            localStorage.setItem('token', response.data.token);
            dispatch(setUser(response.data.user));
            setIsAuth(true);
            toast.success("Login successful!");
            navigate('/dashboard');
        } catch (error) {
            console.log("Error logging in: ", error.message);
            toast.error(error.response?.data?.message || "Invalid email or password");
        }
    }

    const handleSignup = async (e) => {
        e.preventDefault()

        try {
            const response = await axios.post(`${baseUrl}/api/auth/signup`, formData);
            toast.success(response.data.message)
            setActiveModal("login")
            setFormData({})
        } catch (error) {
            console.log("Error signing up:", error.message);
            toast.error(error.response?.data?.message || "Signup failed");
        }
    };

    const btnBase = "px-6 py-3 rounded-lg text-base cursor-pointer transition-all duration-200 ease-in";
    const btnPrimary = `${btnBase} text-white bg-accent hover:bg-accentHover`;
    const btnSecondary = `${btnBase} bg-transparent text-white border border-[#444] hover:bg-[#222]`;
    const inputStyle = "px-3.5 py-3 rounded-lg border border-[#333] bg-[#111] text-white text-[0.95rem] transition-colors duration-500 focus:outline-none focus:border-accent";

    return (
        <>
            <main className="min-h-screen flex flex-col justify-center items-center text-center p-8">
                <h1 className="text-5xl font-bold mb-2">Watch-Party</h1>
                <p className="text-[1.1rem] text-textSecondary max-w-[420px] mb-8">Watch movies together. Talk in real time.</p>
                <div className="flex gap-4">
                    <button className={btnPrimary} onClick={openLoginModal}>Log in</button>
                    <button className={btnSecondary} onClick={openSignupModal}>Sign up</button>
                </div>
            </main>

            <div onClick={closeModal} className={`fixed inset-0 flex justify-center items-center z-[100] transition-all duration-300 ${activeModal ? 'bg-black/55 backdrop-blur-md opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                {activeModal === 'login' && (
                    <div className="bg-bgLight p-8 w-full max-w-[380px] rounded-[14px] shadow-[0_20px_40px_rgba(0,0,0,0.6)] relative animate-popIn" onClick={(e) => e.stopPropagation()}>
                        <button className="absolute top-3 right-3.5 text-2xl bg-transparent border-none text-textSecondary cursor-pointer hover:text-white" onClick={closeModal}>&times;</button>
                        <h2 className="mb-5 text-center text-2xl font-bold">Login</h2>

                        <form className="flex flex-col gap-4" onSubmit={handleLogin}>
                            <input className={inputStyle} onChange={handleChange} type="email" name="email" placeholder="Email" required />
                            <input className={inputStyle} onChange={handleChange} type="password" name="password" placeholder="Password" required />
                            <button type="submit" className={btnPrimary}>Login</button>
                        </form>
                    </div>
                )}

                {activeModal === 'signup' && (
                    <div className="bg-bgLight p-8 w-full max-w-[380px] rounded-[14px] shadow-[0_20px_40px_rgba(0,0,0,0.6)] relative animate-popIn" onClick={(e) => e.stopPropagation()}>
                        <button className="absolute top-3 right-3.5 text-2xl bg-transparent border-none text-textSecondary cursor-pointer hover:text-white" onClick={closeModal}>&times;</button>
                        <h2 className="mb-5 text-center text-2xl font-bold">Signup</h2>

                        <form className="flex flex-col gap-4" onSubmit={handleSignup}>
                            <input className={inputStyle} onChange={handleChange} type="text" name="name" placeholder="Your Name" required />
                            <input className={inputStyle} onChange={handleChange} type="email" name="email" placeholder="Email" required />
                            <input className={inputStyle} onChange={handleChange} type="password" name="password" placeholder="Create Password" required />
                            <button type="submit" className={btnPrimary}>Continue</button>
                        </form>
                    </div>
                )}
            </div>
        </>
    )
}