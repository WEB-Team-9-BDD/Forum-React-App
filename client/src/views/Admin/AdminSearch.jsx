import { useState } from "react";
import { getAllUsers } from "../../services/users.service";

export default function AdminUsersSearch(){
    const [searchInput, setSearchInput] = useState('');

    const searchUsers = async () => {
        const allUsers = await getAllUsers(); 
        const filteredUsers = allUsers.filter(user => user.email.includes(searchInput));
        return filteredUsers;
      };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const results = await searchUsers(searchInput);
        console.log(results); 
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group mb-2 ">
                <label className="form-label" htmlFor="search">Search by E-mail: </label>
                <input autoComplete="off" className="form-control"
                    type="text" name="search" id="search"
                    value={searchInput} onChange={e => setSearchInput(e.target.value)} />
            </div>
            <button type="submit">Search</button>
        </form>
    )
}