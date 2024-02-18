import { useContext, useEffect } from "react"
import { AppContext } from "../../context/AppContext"
import PropTypes from 'prop-types';
import './ProfilePreview.css'
import { CgProfile } from "react-icons/cg";
export default function ProfilePreview({ photoURL, setProfilePhoto, uploadPhoto, userPosts, photo }) {
    const { userData } = useContext(AppContext);

    const handleInputChange = (e) => {
        if (e.target.files[0]) {
            setProfilePhoto(e.target.files[0])
        }
    }
//   console.log(photoURL);
    return (
        <div className="profile-preview">
            <h3>Profile preview</h3>
            <div >
                {(!photoURL) ?
                    <CgProfile className="profile-avatar-icon" /> :
                    <img alt="avatar" className='profile-avatar' src={photoURL} />
                }
                <div>
                    <input type="file" accept="image/*"
                        onChange={handleInputChange} />
                    <p>Username: {userData.username}</p>
                    <p>Registered: {new Date(userData.createdOn).toLocaleDateString('bg-BG')}</p>
                    <p>Number of posts: {userPosts.length}</p>
                    <p>Likes: X</p>
                    <button className="update-profile-button"
                        disabled={(!photo)}
                        onClick={uploadPhoto}>Upload AVATAR</button>
                </div>
            </div>
        </div>
    )
}

ProfilePreview.propTypes = {
    photoURL: PropTypes.string,
    setProfilePhoto: PropTypes.func,
    uploadPhoto: PropTypes.func,
    userPosts: PropTypes.any,
    photo: PropTypes.any,
}