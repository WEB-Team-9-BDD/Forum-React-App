import { NavLink } from "react-router-dom";
import "./Header.css"
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { logoutUser } from "../../services/auth.service";

export default function Header() {
    const { user, setAppState } = useContext(AppContext);
    console.log(user);
    const logout = async () => {
        await logoutUser();
        setAppState({ user: null, userData: null });
    }

    return (
        <header>
            <NavLink to="/">Home</NavLink>

            {user ?
                (
                    <button onClick={logout}>Log out</button>
                ) : (
                    <NavLink to="/login">Log in</NavLink>
                )
            }
        </header >
    )
}