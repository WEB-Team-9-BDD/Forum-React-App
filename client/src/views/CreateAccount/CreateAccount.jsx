import { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext"
import { useNavigate } from "react-router-dom";
import { createUserUsername, getUserByUsername } from "../../services/users.service"
import { registerUser } from "../../services/auth.service"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
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

        if (form.firstName <= 3 && form.firstName >= 32) {
           return alert('First name must be between 3 and 32 symbols');
        }
        if (form.lastName <= 3 && form.lastName >= 32) {
           return alert('Last name must be between 3 and 32 symbols');
        }

        try {
            const user = await getUserByUsername(form.username);
            if (user.exists()) {
                return alert('Username already exists');
            }
            const userCredentials = await registerUser(form.email, form.password);
            await createUserUsername(form.username, form.firstName, form.lastName, form.email, userCredentials.user.uid)

            setAppState({ user, userData: null });
            navigate('/');

        } catch (error) {
            alert(error.message);
        }
    }

    return (
        <div className="wrapper d-flex align-items-center justify-content-center w-100">
            <div className="create-account">
                <h1 className="mb-3 text-center">Create Account</h1>
                <div className="form-group mb-2 ">
                    <label className="form-label" htmlFor="username">Username: </label>
                    <input className="form-control" type="text" name="username" id="username" value={form.username} onChange={updateForm('username')} />
                </div>
                <div className="form-group mb-2 ">
                    <label className="form-label" htmlFor="email">Your e-mail: </label>
                    <input className="form-control" type="email" name="email" id="email" value={form.email} onChange={updateForm('email')} />
                </div>
                <div className="form-group mb-2 ">
                    <label className="form-label" htmlFor="password">Password: </label>
                    <input className="form-control" type={showPassword ? 'text': 'password'} name="password" id="password" value={form.password} onChange={updateForm('password')} />
                    <span className="password-span"><FontAwesomeIcon
                        onClick={() => setShowPassword(!showPassword)}
                        icon={showPassword ? faEye : faEyeSlash} />
                    </span>
                </div>
                <div className="form-group mb-2 ">
                    <label className="form-label" htmlFor="first-name">First Name: </label>
                    <input className="form-control" type="text" name="first-name" id="first-name" value={form.firstName} onChange={updateForm('firstName')} />
                </div>
                <div className="form-group mb-2 ">
                    <label className="form-label" htmlFor="last-name">Last Name: </label>
                    <input className="form-control" type="text" name="last-name" id="last-name" value={form.lastName} onChange={updateForm('lastName')} />
                </div>
                <button className="btn btn-success mt-4 mb-3 w-100 " onClick={createUser}>Create account</button>
            </div>
        </div >
    )
}