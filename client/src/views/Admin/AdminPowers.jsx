import { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext"
import { useNavigate } from "react-router-dom";
import { getUserByUsername, getUserDataByUsername, makeUserAdmin } from "../../services/users.service"
import toast from 'react-hot-toast';

export default function AdminPowers() {
    const { setAppState } = useContext(AppContext);

    const [form, setForm] = useState({
        username: '',
        isAdmin: false
    });

    const navigate = useNavigate();

    const updateForm = prop => e => {
        setForm({ ...form, [prop]: e.target.value })
    }

    const makeAdmin = async () => {
        try {
            const user = await getUserByUsername(form.username);
            if (!user.exists()) {
                toast.error('User with this e-mail does not exist');
                return
            }
            
            const userData = await getUserDataByUsername(form.username);
            if(userData.isAdmin){
                toast.error('User is already an admin');
                return
            }

            await makeUserAdmin(form.username);

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
                <label className="form-label" htmlFor="username">Username: </label>
                <input autoComplete="off" className="form-control"
                    type="text" name="username" id="username"
                    value={form.username} onChange={updateForm('username')} />
            </div>
            <button className="btn btn-primary" onClick={makeAdmin}>Make Admin</button>
        </div>
        </div>
    );
}