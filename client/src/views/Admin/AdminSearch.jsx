import { useState } from "react";
import { getAllUsers } from "../../services/users.service";

export default function AdminUsersSearch(){
    const [searchInput, setSearchInput] = useState({
        searchInput: '',
    });

    const updateForm = prop => e => {
        setSearchInput({ ...searchInput, [prop]: e.target.value })
    }

    const searchUsers = async () => {
        const allUsers = await getAllUsers(); 
        const filteredUsers = allUsers.filter(user => user.username.includes(searchInput.username));
        return filteredUsers;
      };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const results = await searchUsers(searchInput);
        console.log(results); 
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1>Make User Admin</h1>
            <div className="form-group mb-2">
                <label className="form-label" htmlFor="username">Username: </label>
                <input autoComplete="off" className="form-control"
                    type="text" name="username" id="username"
                    value={searchInput.username} onChange={updateFormSeach('username')} />
            </div>
            <button className="btn btn-primary" onClick={searchUsers}>Search</button>
        </form>
    )
}