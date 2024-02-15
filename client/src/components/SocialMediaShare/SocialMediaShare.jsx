import { useState } from "react";
import {
    FacebookShareButton, FacebookMessengerShareButton,
    LinkedinShareButton, TwitterShareButton
} from "react-share";

export default function socialMediaShare() {
    const [URL, setURL] = useState('');

    return (
        <div>
<FacebookShareButton/>
<FacebookMessengerShareButton/>
<LinkedinShareButton/>
<TwitterShareButton/>
        </div>
    )
}