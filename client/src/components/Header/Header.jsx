import { NavLink, useNavigate } from "react-router-dom";
import "./Header.css"
import { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { logoutUser } from "../../services/auth.service";
import PropTypes from 'prop-types'
import { CgProfile } from "react-icons/cg";
import { MdOutlineSettings } from "react-icons/md";
import { RxHamburgerMenu } from "react-icons/rx";
import { FaPowerOff } from "react-icons/fa";


export default function Header({ toggle }) {
    const { user, userData, setAppState } = useContext(AppContext);
    const [visible, setVisible] = useState(false);

    const navigate = useNavigate();

    const logout = async () => {
        await logoutUser();
        setAppState({ user: null, userData: null });
        toggleProfile();
        navigate('/');
    }

    const getUserInitials = () => {
        const firstName = userData.firstName[0].toUpperCase();
        const lastName = userData.lastName[0].toUpperCase();

        return firstName + lastName;
    }

    const toggleProfile = () => {
        setVisible(!visible);
    }

    return (
        <>
            <header>
                <RxHamburgerMenu onClick={toggle} />
                <NavLink to="/">Home</NavLink>
                <NavLink to="/posts">All posts</NavLink>
                <NavLink to="/post-create">Create Post</NavLink>
                {!user ?
                    (<>
                        <NavLink to="/login">Login</NavLink>
                    </>
                    ) : (
                        <>
                            {`Welcome, ${userData?.username} `}
                        </>
                    )
                }
                {user &&
                    <>
                        <div className="profile-view" onClick={toggleProfile}>
                            <img src={`${user.photoURL}`} alt="avatar" className="header-profile-pic" />
                            <p>{getUserInitials()}</p>
                        </div>
                        {visible && (
                            <div className="header-profile">
                                <div className="profile-overlay" onClick={toggleProfile}></div>
                                <div className="header-profile-content">
                                    <NavLink to="/user-profile" onClick={toggleProfile}><CgProfile className="profile-icons" />Profile</NavLink>
                                    <NavLink to="/update-profile" onClick={toggleProfile}><MdOutlineSettings className="profile-icons" />Settings</NavLink>
                                    <div className="logout" onClick={logout}> <FaPowerOff className="profile-icons" />
                                        Log out</div>
                                </div>
                            </div>
                        )}
                    </>
                }
            </header >
        </>
    )
}


Header.propTypes = {
    toggle: PropTypes.func,
}