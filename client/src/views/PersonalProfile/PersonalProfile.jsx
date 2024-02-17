import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { Link, useNavigate } from "react-router-dom";
import './PersonalProfile.css'
import { getPostsByAuthor } from "../../services/post.service";
import { uploadProfilePicture } from "../../services/users.service";

export default function PersonalProfile() {
    const [photoURL, setPhotoURL] = useState('');
    const { user, userData } = useContext(AppContext);
    const [userPosts, setUserPosts] = useState([]);
    const [image, setImage] = useState(null);

    const navigate = useNavigate();
    useEffect(() => {
        getPostsByAuthor(userData.username).then(setUserPosts);
    }, []);

    useEffect(() => {
        if (user?.photoURL) {
            setPhotoURL(user.photoURL)
        }
    }, [user]);

    const uploadPhoto = async () => {
        try {
            await uploadProfilePicture(image, user);
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <>
            <div>
                <div>
                    <h3>Profile preview</h3>
                    <div >
                        <img alt="avatar" className='profile-avatar' src={photoURL} />
                        <input type="file" accept="image/*"
                            onChange={(e) => setImage(e.target.files[0])} />
                        <button className="btn btn-primary" onClick={uploadPhoto}>UPLOAD AVATAR</button>
                        <p>Username: {userData.username}</p>
                        <p>Registered: {new Date(userData.createdOn).toLocaleDateString('bg-BG')}</p>
                        <p>Number of posts: {userPosts.length}</p>
                        <p>Likes: X</p>
                    </div>
                    <button className="update-profile-button" onClick={() => navigate('/update-profile')}>Update profile</button>
                </div>
                <div>
                    <h4>My posts</h4>
                    <div className="personal-profile-posts">
                        {userPosts ?
                            (
                                userPosts.map((post) => {
                                    return <div key={post.id}>
                                        <Link key={post.id} to={`/ posts / ${post.id}`} >{post.title}</Link >

                                    </div>
                                }
                                )
                            ) : (
                                <h5>You haven`t posted yet.</h5>
                            )
                        }
                    </div>
                </div >
            </div >
        </>
    )
}