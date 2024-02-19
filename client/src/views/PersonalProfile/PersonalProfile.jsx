import {useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { Link, useNavigate } from "react-router-dom";
import './PersonalProfile.css'
import { getPostsByAuthor } from "../../services/post.service";
import { uploadProfilePicture } from "../../services/users.service";
import toast from "react-hot-toast";
import ProfilePreview from "../../components/ProfilePreview/ProfilePreview";
import { MdOutlinePostAdd } from "react-icons/md";
import SocialMediaShare from '../../components/SocialMediaShare/SocialMediaShare'

export default function PersonalProfile() {

    const { user, userData } = useContext(AppContext);
    const [photoURL, setPhotoURL] = useState('');
    const [userPosts, setUserPosts] = useState([]);
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [fileName, setFileName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        getPostsByAuthor(userData.username).then(setUserPosts);
    }, []);

    useEffect(() => {
        if (user && user.photoURL) {
            setPhotoURL(user.photoURL)
        }
    }, [user]);

    const uploadPhoto = async () => {
        try {
            const res = await uploadProfilePicture(profilePhoto, user);
            setPhotoURL(res);
            setFileName('');
            toast.success('Profile photo added successfully.');
        } catch (error) {
            toast.error(error.code);
        }
    };

    return (
        <>
            <div className='user-profile-container'>
                <ProfilePreview photoURL={photoURL} setProfilePhoto={setProfilePhoto}
                    uploadPhoto={uploadPhoto} userPosts={userPosts} photo={profilePhoto} 
                    fileName={fileName} setFileName={setFileName}/>

                <div className="personal-profile-posts">
                    <h4>My posts</h4>
                    {userPosts.length ?
                        (
                            userPosts.map((post) => {
                                return <div className="my-posts-item" key={post.id}>
                                    <MdOutlinePostAdd />
                                    <Link key={post.id} to={`/posts/${post.id}`} >{post.title}</Link >
                                    <SocialMediaShare id={post.id} />
                                </div>
                            }
                            )
                        ) : (
                            <div>
                                <h5>You haven`t posted yet.</h5>
                            </div>
                        )
                    }
                </div>
            </div >
        </>
    )
}