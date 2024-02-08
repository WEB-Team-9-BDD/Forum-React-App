import { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext"
import { useNavigate } from "react-router-dom";
import { createUserUsername, getUserByUsername } from "../../services/users.service"
import { registerUser } from "../../services/auth.service"

export default function CreateAccount() {
    const { setAppState } = useContext(AppContext);
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
            alert('First name must be between 3 and 32 symbols');
        }
        if (form.lastName <= 3 && form.lastName >= 32) {
            alert('Last name must be between 3 and 32 symbols');
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
        <div>
            <h1>Create Account</h1>

            <label htmlFor="username">Username: </label>
            <input type="text" name="username" id="username" value={form.username} onChange={updateForm('username')} />
            <br /><br />
            <label htmlFor="email">Your e-mail: </label>
            <input type="email" name="email" id="email" value={form.email} onChange={updateForm('email')} />
            <br /><br />
            <label htmlFor="password">Password: </label>
            <input type="password" name="password" id="password" value={form.password} onChange={updateForm('password')} />
            <br /><br />
            <label htmlFor="first-name">First Name: </label>
            <input type="text" name="first-name" id="first-name" value={form.firstName} onChange={updateForm('firstName')} />
            <br /><br />
            <label htmlFor="last-name">Last Name: </label>
            <input type="text" name="last-name" id="last-name" value={form.lastName} onChange={updateForm('lastName')} />
            <br /><br />
            <button onClick={createUser}>Create account</button>

        </div>
    )
}