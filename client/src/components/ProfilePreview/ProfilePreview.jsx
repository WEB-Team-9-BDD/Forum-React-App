import { useContext, useState } from "react"
import { AppContext } from "../../context/AppContext"
import PropTypes from 'prop-types';
import './ProfilePreview.css'
import { CgProfile } from "react-icons/cg";
import { MdFileUpload } from "react-icons/md";

export default function ProfilePreview({ photoURL, setProfilePhoto, uploadPhoto, userPosts, photo, fileName, setFileName }) {
    const { userData } = useContext(AppContext);

    const handleInputChange = (e) => {
        if (e.target.files[0]) {
            setProfilePhoto(e.target.files[0])
            setFileName(e.target.files[0].name);
        }
    }

    return (
        <div className="profile-preview">
            <div >
                {(!photoURL) ?
                    <CgProfile className="profile-avatar-icon" /> :
                    <img alt="avatar" className='profile-avatar' src={photoURL} />
                }
                <div>

                    <label className="photo-upload-label"
                        htmlFor="profile-photo-upload">
                        Choose file<span>{fileName ? (`: ${fileName}`) : null}</span></label>

                    <input type="file" accept="image/*"
                        id="profile-photo-upload" onChange={handleInputChange} />
                    
                    <p>Username: {userData.username}</p>
                    <p>Registered: {new Date(userData.createdOn).toLocaleDateString('bg-BG')}</p>
                    <p>Number of posts: {userPosts.length}</p>
                    <button className="photo-upload-button"
                        disabled={(!photo)}
                        onClick={uploadPhoto}><MdFileUpload />Upload AVATAR</button>
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
    fileName: PropTypes.string,
    setFileName: PropTypes.func,
}