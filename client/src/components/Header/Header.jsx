import { NavLink, useNavigate } from "react-router-dom";
import "./Header.css"
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { logoutUser } from "../../services/auth.service";
import { RxHamburgerMenu } from "react-icons/rx";
import PropTypes from 'prop-types'


export default function Header({ toggle }) {
    const { user, userData, setAppState } = useContext(AppContext);


    const navigate = useNavigate();
    const logout = async () => {
        await logoutUser();
        setAppState({ user: null, userData: null });
        navigate('/');
    }

    return (
        <>
            <header>
                <RxHamburgerMenu onClick={toggle} />
                <NavLink to="/">Home</NavLink>
                {!user ?
                    (<>
                        <NavLink to="/login">Login</NavLink>
                    </>
                    ) : (
                        <>
                            {`Welcome, ${userData?.username} `}
                            <button className="btn btn-primary" onClick={logout}>Log out</button>
                        </>
                    )
                }
                {user && <NavLink to="/user-profile">Profile</NavLink>}
            </header >
        </>
    )
}


Header.propTypes = {
    toggle: PropTypes.func,
}