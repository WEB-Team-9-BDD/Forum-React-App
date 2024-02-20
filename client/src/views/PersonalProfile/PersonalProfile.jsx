import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import './PersonalProfile.css'
import { getPostsByAuthor } from "../../services/post.service";
import { updatePhotoURL, uploadProfilePicture } from "../../services/users.service";
import toast from "react-hot-toast";
import ProfilePreview from "../../components/ProfilePreview/ProfilePreview";
import PostPreview from '../../components/PostPreview/PostPreview'
import { BsPostcardHeart } from "react-icons/bs";

export default function PersonalProfile() {

    const { user, userData } = useContext(AppContext);
    const [photoURL, setPhotoURL] = useState('');
    const [userPosts, setUserPosts] = useState([]);
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [fileName, setFileName] = useState('');

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
            await updatePhotoURL(userData.username, res);
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
                                    <h5>No posted yet.</h5>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div >
        </>
    )
}