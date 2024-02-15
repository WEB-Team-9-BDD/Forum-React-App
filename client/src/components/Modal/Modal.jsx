import PropTypes from 'prop-types';
import './Modal.css'
import { deletePost } from '../../services/post.service';
import toast from 'react-hot-toast';

export default function Modal({ show, toggle, id }) {

    const deleteSinglePost = async (postId) => {
        try {
          await deletePost(postId);
          toast.success('Post successfully deleted');
            toggle();
        } catch (error) {
          toast.error(error.code);
        }
      };


    if (!show) return null;
    return (

        <div className='modal-container'>
            <div className='overlay' onClick={toggle}></div>
            <div className='modal-content'>
                <h4>Are you sure want to delete this post ?</h4>
                <div className='modal-buttons'>
                    <button className='btn btn-primary col-4'
                        onClick={() => deleteSinglePost(id)}
                    >Yes</button>
                    <button className='btn btn-primary col-4'
                        onClick={toggle}
                    >No</button>
                </div>
            </div>
        </div>
    )
}

Modal.propTypes = {
    show: PropTypes.bool,
    toggle: PropTypes.func,
    id: PropTypes.string,
}