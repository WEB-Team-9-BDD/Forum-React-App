import { NavLink } from "react-router-dom";
import "./Header.css"
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { logoutUser } from "../../services/auth.service";

export default function Header() {
    const { user, userData, setAppState } = useContext(AppContext);
    // console.log(user);
    // console.log(userData.username);
    const logout = async () => {
        await logoutUser();
        setAppState({ user: null, userData: null });
    }

    return (
        <header>
            <NavLink to="/">Home</NavLink>

            {!user ?
                (<>
                    <NavLink to="/login">Login</NavLink>
                </>
                ) : (
                    <>
                        {`Welcome, User `}
                        <button onClick={logout}>Log out</button>
                    </>
                )
            }
        </header >
    )
}