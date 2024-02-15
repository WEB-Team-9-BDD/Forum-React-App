import { useContext, useState, useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import './UpdateAccount.css'
import { createUserUsername } from "../../services/users.service";
import { updateEmail, updatePassword } from 'firebase/auth'
import { logoutUser } from "../../services/auth.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

export default function UpdateAccount() {
    const { user, userData, setAppState } = useContext(AppContext);
    const [isAdmin, setIsAdmin] = useState(false);
    const [showPassword, setShowPassword] = useState({
        password: false,
        confirmPassword: false
    });

    const [form, setForm] = useState({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phoneNumber: userData.phoneNumber,
        isAdmin: userData.isAdmin,
        password: '',
        confirmPassword: '',
    });
    const navigate = useNavigate();

    const updateForm = prop => e => {
        setForm({ ...form, [prop]: e.target.value })
    };

    const updateUser = async () => {

        try {
            if (form.confirmPassword && form.password === form.confirmPassword) {
                await updatePassword(user, form.confirmPassword);
                toast.success('Password has been changed successfully!');
            }
            form.email !== userData.email ? await updateEmail(user, form.email) : null
            await createUserUsername(userData.username, form.firstName, form.lastName, form.email, userData.uid);
            await logoutUser();
            setAppState({ user: null, userData: null });
            toast.success('Account updated successfully!');
            navigate('/');
        } catch (error) {
            toast.error(error.message);
        }
    }

    useEffect(() => {
        const checkAdminStatus = async () => {
            if (userData && user.isAdmin) {
                setIsAdmin(true);
            } else {
                setIsAdmin(false);
            }
        };
        checkAdminStatus();
    }, [user, userData]);


    return (
        <div>
            <div className="wrapper d-flex align-items-center justify-content-center w-100">
            {userData.isAdmin && (
                    <div>
                        <Link to="/admin-powers">Admin Powers</Link>
                    </div>
                )}
                <div className="update-account">
                    <h2 className="heading mb-3 text-center">Update Account</h2>
                    <form onSubmit={e => e.preventDefault()} >
                        <div className="form-group mb-2 ">
                            <label className="form-label" htmlFor="username">Username: </label>
                            <input readOnly disabled autoComplete="off" className="form-control"
                                type="text" name="username" id="username"
                                value={userData.username} />
                        </div>
                        <div className="form-group mb-2 ">
                            <label className="form-label" htmlFor="email">Your e-mail: </label>
                            <input autoComplete="off" className="form-control"
                                type="email" name="email" id="email" value={form.email}
                                onChange={updateForm('email')} />
                        </div>

                        <div className="form-group mb-2 ">
                            <label className="form-label" htmlFor="first-name">First Name: </label>
                            <input autoComplete="off" className="form-control" type="text"
                                name="first-name" id="first-name" value={form.firstName}
                                onChange={updateForm('firstName')} />
                        </div>
                        <div className="form-group mb-2 ">
                            <label className="form-label" htmlFor="last-name">Last Name: </label>
                            <input autoComplete="off" className="form-control"
                                type="text" name="last-name" id="last-name"
                                value={form.lastName} onChange={updateForm('lastName')} />
                        </div>
                        {userData.isAdmin && (
                        <div className="form-group mb-2 ">
                            <label className="form-label" htmlFor="phone-number">Phone Number: </label>
                            <input autoComplete="off" className="form-control"
                                type="text" name="phone" id="phone-number"
                                value={form.phoneNumber} onChange={updateForm('phoneNumber')} />
                        </div>
                        )}
                        <hr />
                        <div className="form-group mb-2 ">
                            <label className="form-label" htmlFor="password">New password: </label>
                            <input autoComplete="off"
                                className="form-control" type={showPassword.password ? 'text' : 'password'}
                                name="password" id="password" value={form.password}
                                onChange={updateForm('password')} />
                            <span className="password-span"><FontAwesomeIcon
                                onClick={() => setShowPassword({ ...showPassword, password: !showPassword.password })}
                                icon={showPassword.password ? faEye : faEyeSlash} />
                            </span>
                        </div>
                        <div className="form-group mb-2 ">
                            <label className="form-label" htmlFor="confirm-password">Confirm password: </label>
                            <input autoComplete="off"
                                className="form-control" type={showPassword.confirmPassword ? 'text' : 'password'}
                                name="confirm-password" id="confirm-password" value={form.confirmPassword}
                                onChange={updateForm('confirmPassword')} />
                            <span className="password-span"><FontAwesomeIcon
                                onClick={() => setShowPassword({ ...showPassword, confirmPassword: !showPassword.confirmPassword })}
                                icon={showPassword.confirmPassword ? faEye : faEyeSlash} />
                            </span>
                        </div>
                        <button type="submit" className="btn btn-success mt-4 mb-1 w-100"
                            onClick={updateUser}>Update account</button>
                    </form>
                </div>
            </div >
        </div>
    )
}