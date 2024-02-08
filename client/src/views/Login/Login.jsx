import { useContext, useEffect, useState } from "react";
import { loginUser } from "../../services/auth.service";
import { AppContext } from "../../context/AppContext";
import { useLocation, useNavigate } from "react-router-dom";

export default function Login() {
    const { user, setAppState } = useContext(AppContext);
    const [form, setForm] = useState({
        email: '',
        password: '',
    });
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (user) {
            navigate(location.state?.from.pathname || '/')
        }
    }, [user]);

    const updateForm = prop => e => {
        setForm({ ...form, [prop]: e.target.value });
    }

    const login = async () => {
        try {
            const userCredentials = await loginUser(form.email, form.password);
            setAppState({ user: userCredentials.user, userData: null });
        } catch (error) {
            alert(error.message);
        }
    }

    const loginOnEnter = (e) => {
        if (e.key === 'Enter') {
            (async () => login())();
        }
    }

    return (
        <div>
            <h1>User Login</h1>
            <label htmlFor="email">Your e-mail: </label>
            <input type="email" name="email" id="email" onKeyDown={loginOnEnter} value={form.email} onChange={updateForm('email')} />
            <br /><br />
            <label htmlFor="password">Password: </label>
            <input type="password" name="password" id="password" onKeyDown={loginOnEnter} value={form.password} onChange={updateForm('password')} />
            <br /><br />
            <button onClick={login}>Login</button>
            <br />
            <p>Don`t have an account ?<button onClick={() => navigate('/create-account')}>Sign up</button></p>
        </div>
    )
}