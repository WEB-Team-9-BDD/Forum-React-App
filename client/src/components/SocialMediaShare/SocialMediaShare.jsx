import { useEffect, useState } from "react";
import PropTypes from 'prop-types';

import {
    FacebookShareButton, FacebookIcon,
    LinkedinShareButton, LinkedinIcon,
    TwitterShareButton, XIcon
} from "react-share";
import { GoShareAndroid } from "react-icons/go";
import { getPostById } from "../../services/post.service";



export default function SocialMediaShare({ id }) {
    const [currentURL, setCurrentURL] = useState(`${window.location.origin}/posts/${id}`);
    const [visible, setVisible] = useState(false);

    return (
        <>
            <GoShareAndroid className="share-button" onClick={() => { setVisible(!visible) }} />
            {visible && (
                <div className="share-options">
                    {/* <div className="share-content"> */}
                    <p>Share options:  </p>
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
            )}
        </>
    )
}


SocialMediaShare.propTypes = {
    id: PropTypes.string,
}