import PropTypes from 'prop-types';
import './UserPreview.css'
import { BsPostcardHeart } from "react-icons/bs";
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getUserDataByUsername } from '../../services/users.service';
import PostPreview from '../PostPreview/PostPreview';
import { getPostsByAuthor } from '../../services/post.service';
import { CgProfile } from "react-icons/cg";


export default function UserPreview() {
    const { username } = useParams(); // get the username from the URL
    const [userData, setUserData] = useState(null);
    const [userProfilePosts, setUserProfilePosts] = useState([]);

    useEffect(() => {
        getUserDataByUsername(username).then(data => setUserData(data));
        getPostsByAuthor(username).then(posts => setUserProfilePosts(posts));
    }, [username]);

    if (!userData) {
        return <div>Loading...</div>; // show a loading message while the data is being fetched
    }

    return (
        <>
            <div className='user-profile-container'>
                {/* User info */}
                <div className="user-info">
                    {/* User avatar */}
                    <div >
                    {(!userData.photoURL) ?
                    <CgProfile className="profile-avatar-icon" /> :
                    <img alt="avatar" className='profile-avatar' src={userData.photoURL} />
                }
                    </div>
                    {/* User name */}
                    <h3>{userData.username}</h3>
                    {/* User full name */}
                    <p><strong> <em>{userData.firstName} {userData.lastName} </em></strong></p>
                    {/* Number of posts */}
                    <p>Number of posts: <span>{userProfilePosts.length}</span></p>
                    {/* Member since */}
                    <p>Member since: <strong>{new Date(userData.createdOn).toLocaleDateString('bg-BG')}</strong></p>
                </div>

                {/* User posts */}
                <div className="personal-profile-posts">
                    {userProfilePosts.length ?
                        (
                            userProfilePosts.map((post) => {
                                return <PostPreview post={post} key={post.id} />
                            }
                            )
                        ) : (
                            <div className='profile-no-posts'>
                                <div>
                                    <BsPostcardHeart />
                                    <h5>No posts yet.</h5>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div >
        </>
    )
}

UserPreview.propTypes = {
    photoURL: PropTypes.string,
    userPosts: PropTypes.any,
}