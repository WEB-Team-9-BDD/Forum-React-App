import { useState } from "react";
import PropTypes from 'prop-types';
import {
    FacebookShareButton, FacebookIcon,
    LinkedinShareButton, LinkedinIcon,
    TwitterShareButton, XIcon
} from "react-share";
import { GoShareAndroid } from "react-icons/go";
import './SocialMediaShare.css'

export default function SocialMediaShare({ id }) {
    const [currentURL, setCurrentURL] = useState(`${window.location.origin}/posts/${id}`);
    const [visible, setVisible] = useState(false);

    const toggleShare = () => {
        setVisible(!visible);
    }

    return (
        <div className="share-container">

            {visible && (
                <>
                    <div className="share-options">
                        <div className='share-overlay' onClick={toggleShare}></div>
                        <div className="share-buttons">
                        <p>Share:  </p>
                            <FacebookShareButton url={currentURL}>
                                <FacebookIcon round onClick={toggleShare} />
                            </FacebookShareButton>
                            <TwitterShareButton url={currentURL}>
                                <XIcon round onClick={toggleShare} />
                            </TwitterShareButton>
                            <LinkedinShareButton url={currentURL} >
                                <LinkedinIcon round onClick={toggleShare} />
                            </LinkedinShareButton>
                        </div>
                    </div>
                </>
            )}
            <GoShareAndroid className="share-button" onClick={toggleShare} />
        </div>

    )
}


SocialMediaShare.propTypes = {
    id: PropTypes.string,
}