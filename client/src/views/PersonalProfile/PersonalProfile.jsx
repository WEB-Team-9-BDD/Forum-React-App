import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { Link, useNavigate } from "react-router-dom";
import './PersonalProfile.css'
import { getPostsByAuthor } from "../../services/post.service";
import { uploadProfilePicture } from "../../services/users.service";
import toast from "react-hot-toast";
import ProfilePreview from "../../components/ProfilePreview/ProfilePreview";
import PostPreview from '../../components/PostPreview/PostPreview'
import { MdOutlinePostAdd } from "react-icons/md";
import SocialMediaShare from '../../components/SocialMediaShare/SocialMediaShare'
import { BsPostcardHeart } from "react-icons/bs";


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
                    fileName={fileName} setFileName={setFileName} />

                <div className="personal-profile-posts">
                    {userPosts.length ?
                        (
                            userPosts.map((post) => {
                                return <PostPreview post={post} key={post.id} />
                            }
                            )
                        ) : (
                            <div className='profile-no-posts'>
                                <div>
                                    <BsPostcardHeart />
                                    <h5>You haven`t posted yet.</h5>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div >
        </>
    )
}