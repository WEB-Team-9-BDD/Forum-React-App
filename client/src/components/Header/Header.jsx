import { NavLink, useNavigate } from "react-router-dom";
import "./Header.css"
import { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { logoutUser } from "../../services/auth.service";
import Sidebar from "../Sidebar/Sidebar";
import { RxHamburgerMenu } from "react-icons/rx";


export default function Header() {
    const { user, userData, setAppState } = useContext(AppContext);
    const [showSidebar, setShowSidebar] = useState(false);

    const navigate = useNavigate();
    const logout = async () => {
        await logoutUser();
        setAppState({ user: null, userData: null });
        navigate('/');
    }

    return (
        <>
        <header>
        <RxHamburgerMenu onClick={() =>  setShowSidebar(!showSidebar)} />
            <NavLink to="/">Home</NavLink>
            {!user ?
                (<>
                    <NavLink to="/login">Login</NavLink>
                </>
                ) : (
                    <>
                        {`Welcome, ${userData?.username} `}
                        <button onClick={logout}>Log out</button>
                    </>
                )
            }
            {user && <NavLink to="/user-profile">Profile</NavLink>}
        </header >
        <Sidebar show={showSidebar}/>
        </>
    )
}