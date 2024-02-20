import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { getUserDataByUsername } from '../../services/users.service'
import { CgProfile } from "react-icons/cg";
import './ProfileCard.css'
import { getPostsByAuthor } from '../../services/post.service';
import Loader from '../../components/Loader/Loader'

export default function ProfileCard({ username }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [userPosts, setUserPosts] = useState(null);

    useEffect(() => {
        getUserDataByUsername(username).then(setCurrentUser);
        getPostsByAuthor(username).then(setUserPosts);
    }, []);

    return (
        <>
            <div className="mini-preview">
                {currentUser && userPosts ?
                    (<div >
                        {(!currentUser.photoURL) ?
                            <CgProfile className="mini-profile-avatar" /> :
                            <img alt="avatar-mini" className='mini-profile-avatar' src={currentUser.photoURL} />
                        }
                        <div>
                            <h3>{currentUser.username}</h3>
                            <p><strong> <em>{currentUser.firstName} {currentUser.lastName} </em></strong></p>
                            <div>
                                <p className="number-of-posts">Number of posts: <span>{userPosts.length}</span></p>
                            </div>
                            <p>Member since: <strong>{new Date(currentUser.createdOn).toLocaleDateString('bg-BG')}</strong></p>
                        </div>
                    </div>) : (<Loader />)
                }
            </div>
        </>

    )
}

ProfileCard.propTypes = {
    username: PropTypes.string,
}
