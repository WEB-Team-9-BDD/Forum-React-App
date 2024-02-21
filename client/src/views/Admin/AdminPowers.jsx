import { useState, useEffect } from "react";
import { getUserByUsername, getUserDataByUsername, makeUserAdmin } from "../../services/users.service"
import toast from 'react-hot-toast';
import { getAllUsers } from "../../services/users.service";
import { blockUser } from "../../services/users.service";
import { unblockUser } from "../../services/users.service";
import './AdminPowers.css';

export default function AdminPowers() {
    // Make Admin Button
    const [form, setForm] = useState({
        username: '',
        isAdmin: false
    });

    const makeAdmin = async (username = form.username) => {
        try {
            const user = await getUserByUsername(username);
            if (!user.exists()) {
                toast.error('User with this e-mail does not exist');
                return
            }
            
            const userData = await getUserDataByUsername(username);
            if(userData.isAdmin){
                toast.error('User is already an admin');
                return
            }

            await makeUserAdmin(username);

            setForm({ ...form, isAdmin: true });

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
    const [searchPerformed, setSearchPerformed] = useState(false);

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
        setSearchPerformed(true);
    };

    const [allUsers, setAllUsers] = useState([]);

    useEffect(() => {
        const fetchAllUsers = async () => {
            const users = await getAllUsers();
            setAllUsers(users);
        };
        fetchAllUsers();
    }, [])

    useEffect(() => {
        if (searchInput.username === '') {
            setSearchPerformed(false);
        }
    }, [searchInput]);

    //Block user
    const [blockForm, setBlockForm] = useState({
        username: '',
        isBlocked: 'false',
    });

    const blockUserHandler = async (username) => {
        const userData = await getUserDataByUsername(username);
        try {
            if(userData.isBlocked){
                toast.error('Error! User is already blocked');
                return
            }

            await blockUser(username);

            setBlockForm({ ...blockForm, isBlocked: true });
            toast.success('User has been blocked');
        } catch (error) {
            toast.error(error.message);
        }
    };

    //Unblock user
    const [unblockForm, setUnblockForm] = useState({
        username: '',
        isBlocked: 'true',
    });

    const unblockUserHandler = async (username) => {
        const userData = await getUserDataByUsername(username);
        try {
            if(!userData.isBlocked){
                toast.error('Error! User is not blocked');
                return
            }

            await unblockUser(username);

            setUnblockForm({ ...unblockForm, isBlocked: false });
            toast.success('User has been unblocked');
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <form className="admin-powers-form" onSubmit={handleSubmit}>
            <h1 className="search-user">Search user</h1>
            <h4 className="username">Username: </h4>
            <input autoComplete="off" className="form-control"
                type="text" id="username"
                value={searchInput.username} onChange={updateFormSearch('username')} />
            <button className="search-button" onClick={handleSubmit}>Search</button>
            <h2>Search Results</h2>
            <div className="search-results">
                {(!searchPerformed ? allUsers : searchResults).map((user, index) => (
                    <div className="search-results-item" key={index}>
                        <div className="user-info">
                            {user.username}
                        </div>
                        <div className="use-actions">
                        {!user.isBlocked ? 
                            <button className="block" onClick={async () => {
                                await blockUserHandler(user.username);
                                const updatedUsers = allUsers.map(u => u.username === user.username ? {...u, isBlocked: true} : u);
                                setAllUsers(updatedUsers);
                                setSearchResults(updatedUsers.filter(u => u.username.includes(searchInput.username)));
                            }}>Block User</button>
                            :
                            <button className="unblock" onClick={async () => {
                                await unblockUserHandler(user.username);
                                const updatedUsers = allUsers.map(u => u.username === user.username ? {...u, isBlocked: false} : u);
                                setAllUsers(updatedUsers);
                                setSearchResults(updatedUsers.filter(u => u.username.includes(searchInput.username)));
                            }}>Unblock User</button>
                        }
                        <button className="make-admin" onClick={() => makeAdmin(user.username)}>Make Admin</button>
                        </div>
                </div>
                ))}
            </div>
        </form>
    );
}