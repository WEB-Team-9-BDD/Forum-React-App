import { useContext, useEffect, useState } from "react";
import { loginUser } from "../../services/auth.service";
import { AppContext } from "../../context/AppContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Login.css"

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
        <div className="wrapper d-flex align-items-center justify-content-center w-100">
            <div className="login">
                <h1 className="mb-3 text-center">User Login</h1>
                    <div className="form-group mb-2 ">
                        <label htmlFor="email" className="form-label">Your e-mail: </label>
                        <input autoComplete="off" className="form-control" type="email" name="email" id="email" value={form.email} 
                        onChange={updateForm('email')} onKeyDown={loginOnEnter} />
                    </div>
                    <div className="form-group mb-2">
                        <label htmlFor="password" className="form-label">Password: </label>
                        <input autoComplete="off" className="form-control" type="password" name="password" id="password" value={form.password} 
                        onChange={updateForm('password')} onKeyDown={loginOnEnter} />
                    </div>
                    <button onClick={login} className="btn btn-success mt-3 mb-2 w-100">Login</button>
                    <br />
                    <p className="mb-3">Don`t have an account ?<Link className="font-weight-bold" to='/create-account'> Sign up</Link></p>
            </div >
        </div>
    )
}