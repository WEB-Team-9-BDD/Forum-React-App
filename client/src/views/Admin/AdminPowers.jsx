import { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext"
import { getUserByUsername, getUserDataByUsername, makeUserAdmin } from "../../services/users.service"
import toast from 'react-hot-toast';
import { getAllUsers } from "../../services/users.service";
import { set } from "lodash";
import { blockUser } from "../../services/users.service";

export default function AdminPowers() {
    // Make Admin Button
    //const { setAppState } = useContext(AppContext);
    const [form, setForm] = useState({
        username: '',
        isAdmin: false
    });

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

            //setAppState({ admin: user, adminData: null });
            toast.success('User has been made an admin');
        } catch (error) {
            toast.error(error.message);
        }
    }

    //Admin search
    const [searchInput, setSearchInput] = useState({
        username: '',
    });

    const [searchResults, setSearchResults] = useState([]);

    const updateFormSearch = prop => e => {
        setSearchInput({ ...searchInput, [prop]: e.target.value })
    }

    const searchUsers = async () => {
        const allUsers = await getAllUsers(); 
        const filteredUsers = allUsers.filter(user => user.username.includes(searchInput.username));
        return filteredUsers;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const results = await searchUsers();
        setSearchResults(results); 
    };

    //Block user
    const [blockForm, setBlockForm] = useState({
        username: '',
        isBlocked: 'false',
    });

    const blockUserHandler = async (username) => {
        const userData = await getUserDataByUsername(username);
        try {
            if(userData.isBlocked){
                toast.error('User is already blocked');
                return
            }

            await blockUser(username);

            setBlockForm({ ...blockForm, isBlocked: true });
            toast.success('User has been blocked');
        } catch (error) {
            toast.error(error.message);
        }
    };

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
        <form onSubmit={handleSubmit}>
            <h1>Search user</h1>
            <div className="form-group mb-2">
                <label className="form-label" htmlFor="username">Username: </label>
                <input autoComplete="off" className="form-control"
                    type="text" name="username" id="username"
                    value={searchInput.username} onChange={updateFormSearch('username')} />
            </div>
            <button className="btn btn-primary" onClick={handleSubmit}>Search</button>
            <ul>
                {searchResults.map((user, index) => (
                    <li key={index}>
                        {user.username}
                        <button onClick={() => blockUserHandler(user.username)}>Block User</button>
                    </li>
                ))}
            </ul>
        </form>
        </div>
    );
}