import { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext"
import { useNavigate } from "react-router-dom";
import { getUserByEmail, makeUserAdmin } from "../../services/users.service"
import toast from 'react-hot-toast';
import './CreateAdmin.css'

export default function CreateAdmin() {
    const { user, userData, setAppState } = useContext(AppContext);

    const [form, setForm] = useState({
        username: userData.username,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
        isAdmin: false,
        phoneNumber: '',
    });

    const navigate = useNavigate();

    const updateForm = prop => e => {
        setForm({ ...form, [prop]: e.target.value })
    }

    const makeAdmin = async () => {
        try {
            const user = await getUserByEmail(form.email);
            if (!user.exists()) {
                toast.error('User with this e-mail does not exist');
                return
            }

            if(userData.isAdmin){
                toast.error('User is already an admin');
                return
            }

            await makeUserAdmin(form.email);

            setForm({ ...form, isAdmin: true });

            setAppState({ admin: user, adminData: null });
            navigate('/');
            toast.success('User has been made an admin');
        } catch (error) {
            toast.error(error.message);
        }
    }

    return (
        <div className="wrapper d-flex align-items-center justify-content-center w-100">
        <div className="create-admin-container">
            <h1>Make User Admin</h1>
            <div className="form-group mb-2">
                <label className="form-label" htmlFor="email">E-mail: </label>
                <input autoComplete="off" className="form-control"
                    type="text" name="email" id="email"
                    value={form.email} onChange={updateForm('isAdmin')} />
            </div>
            <div className="form-group mb-2 ">
                        <label className="form-label" htmlFor="phoneNumber">Your phone number: </label>
                        <input autoComplete="off" className="form-control"
                            type="phoneNumber" name="phoneNumber" id="phoneNumber" value={form.phoneNumber}
                            onChange={updateForm('phoneNumber')} />
                    </div>
            <button className="btn btn-primary" onClick={makeAdmin}>Make Admin</button>
        </div>
        </div>
    );
}