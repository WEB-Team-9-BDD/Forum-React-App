import { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';
import './UpdateProfile.css'


export default function UpdateProfile() {
    const { user, userData, setAppState } = useContext(AppContext);
    const [showPasswords, setShowPasswords] = useState({
        password: false,
        confirmPassword: false,
    });
    const [form, setForm] = useState({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: '',
        confirmPassword: ''
    });

    const navigate = useNavigate();

    const updateForm = prop => e => {
        setForm({ ...form, [prop]: e.target.value })
    }
    const toggleShowPassword = (prop) => {

        setShowPasswords({ ...showPasswords, [prop]: !showPasswords[prop] })
    }

    const updateUser = () => {

    }
    // console.log(showPasswords.password, showPasswords.confirmPassword);

    return (
        <div>
            <div className="wrapper d-flex align-items-center justify-content-center w-100">
                <div className="create-account">
                    <h1 className="heading mb-3 text-center">Update Account</h1>
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
                        <hr />
                        <div className="form-group mb-2 ">
                            <label className="form-label" htmlFor="password">Password: </label>
                            <input autoComplete="off"
                                className="form-control" type={showPasswords.password ? 'text' : 'password'}
                                name="password" id="password" value={form.password}
                                onChange={updateForm('password')} />
                            <span className="password-span"><FontAwesomeIcon
                                onClick={() => toggleShowPassword('password')}
                                icon={showPasswords.password ? faEye : faEyeSlash} />
                            </span>
                        </div>
                        <div className="form-group mb-2 ">
                            <label className="form-label" htmlFor="validate-password">Confirm password: </label>
                            <input autoComplete="off"
                                className="form-control" type={showPasswords.confirmPassword ? 'text' : 'password'}
                                name="validate-password" id="validate-password"
                                onChange={updateForm('confirmPassword')} />
                            <span className="password-span"><FontAwesomeIcon
                                onClick={() => toggleShowPassword('confirmPassword')}
                                icon={showPasswords.confirmPassword ? faEye : faEyeSlash} />
                            </span>
                        </div>
                        <button type="submit" className="btn btn-success mt-4 mb-3 w-100"
                            onClick={() => { }}>Update account</button>
                    </form>
                </div>
            </div >
        </div>
    )
}