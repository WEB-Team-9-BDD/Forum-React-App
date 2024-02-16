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

    return (
        <div className="share-container">
            
            {visible && (
                                
                    <div className="share-options">
                        <p>Share:  </p>
                        <div className="share-buttons">
                            <FacebookShareButton url={currentURL}>
                                <FacebookIcon round />
                            </FacebookShareButton>
                            <TwitterShareButton url={currentURL}>
                                <XIcon round />
                            </TwitterShareButton>
                            <LinkedinShareButton url={currentURL} >
                                <LinkedinIcon round />
                            </LinkedinShareButton>
                        </div>
                    </div>
            )}
            <GoShareAndroid className="share-button" onClick={() => { setVisible(!visible) }} />
        </div>
    )
}


SocialMediaShare.propTypes = {
    id: PropTypes.string,
}