import { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext"
import { useNavigate } from "react-router-dom";
import { createUserUsername, getUserByUsername } from "../../services/users.service"
import { registerUser } from "../../services/auth.service"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';
import './CreateAccount.css'

export default function CreateAccount() {
    const { setAppState } = useContext(AppContext);
    const [showPassword, setShowPassword] = useState(false);

    const [form, setForm] = useState({
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',

    });
    const navigate = useNavigate();

    const updateForm = prop => e => {
        setForm({ ...form, [prop]: e.target.value })
    }

    const createUser = async () => {
        try {
            const user = await getUserByUsername(form.username);
            if (!user && user.exists()) {
                toast.error('Username already exists');
            }
            const userCredentials = await registerUser(form.email, form.password);
            await createUserUsername(form.username, form.firstName, form.lastName, form.email, userCredentials.user.uid)

            setAppState({ user, userData: null });
            navigate('/');

        } catch (error) {
            toast.error(error.message);
        }
    }

    const handleSubmit = () => {
        // e.preventDefault();
        const { username, email, password, firstName, lastName } = form;
        if (firstName <= 3 && firstName >= 32) {
            toast.error('First name must be between 3 and 32 symbols');
            return
        }
        if (lastName <= 3 && lastName >= 32) {
            toast.error('Last name must be between 3 and 32 symbols');
            return
        }
        if (email.length === 0) {
            toast.error('Email cannot be empty');
            return
        }
        if (username.length === 0) {
            toast.error('Username cannot be empty');
            return
        }
        if (password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return
        }
    }

    return (
        <div className="wrapper d-flex align-items-center justify-content-center w-100">
            <div className="create-account">
                <h1 className="heading mb-3 text-center">Create Account</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group mb-2 ">
                        <label className="form-label" htmlFor="username">Username: </label>
                        <input required autoComplete="off" className="form-control"
                            type="text" name="username" id="username"
                            value={form.username} onChange={updateForm('username')} />
                    </div>
                    <div className="form-group mb-2 ">
                        <label className="form-label" htmlFor="email">Your e-mail: </label>
                        <input required autoComplete="off" className="form-control"
                            type="email" name="email" id="email" value={form.email}
                            onChange={updateForm('email')} />
                    </div>
                    <div className="form-group mb-2 ">
                        <label className="form-label" htmlFor="password">Password: </label>
                        <input required autoComplete="off"
                            className="form-control" type={showPassword ? 'text' : 'password'}
                            name="password" id="password" value={form.password}
                            onChange={updateForm('password')} />
                        <span className="password-span"><FontAwesomeIcon
                            onClick={() => setShowPassword(!showPassword)}
                            icon={showPassword ? faEye : faEyeSlash} />
                        </span>
                    </div>
                    <div className="form-group mb-2 ">
                        <label className="form-label" htmlFor="first-name">First Name: </label>
                        <input required autoComplete="off" className="form-control" type="text"
                            name="first-name" id="first-name" value={form.firstName}
                            onChange={updateForm('firstName')} />
                    </div>
                    <div className="form-group mb-2 ">
                        <label className="form-label" htmlFor="last-name">Last Name: </label>
                        <input required autoComplete="off" className="form-control"
                            type="text" name="last-name" id="last-name"
                            value={form.lastName} onChange={updateForm('lastName')} />
                    </div>
                    <button type="submit" className="btn btn-success mt-4 mb-3 w-100"
                        onClick={createUser}>Create account</button>
                </form>
            </div>
        </div >
    )
}