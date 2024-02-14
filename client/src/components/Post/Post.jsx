import PropTypes from 'prop-types';
// import './Post.css';
import Button from '../Button/Button';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { deletePost } from '../../services/post.service';
import toast from "react-hot-toast";

/**
 * 
 * @param {{ post: { id: string, title: string, content: string, createdOn: string, likes: number, dislikes: number, author: string }, onLike: function, onDislike: function }} props 
 */
export default function Post({ post, onLike, onDislike }) {
  const navigate = useNavigate();
  const { userData } = useContext(AppContext);

  // const editPost = async () => {

  // }
  const deleteSinglePost = async () => {
    try {
      await deletePost(post.id);
      toast.success('Post successfully deleted');
      navigate('/posts')
    } catch (error) {
      toast.error(error.code);
    }
  }


  return (
    <div className="post">
      <h4>{post.title}
        <Button onClick={onLike}>Like {post.likes}</Button>
        <Button onClick={onDislike}>Dislike {post.dislikes}</Button>
      </h4>
      <p>{post.content}</p>
      <p>{new Date(post.createdOn).toLocaleDateString('bg-BG')}</p>
      {/* <Button onClick={() => navigate(`/posts/${post.id}`)}>View</Button> */}
      {userData.username === post.author ?
        (<>
          <Button onClick={() => { }}>Edit</Button>
          <Button onClick={deleteSinglePost}>Delete</Button>
        </>) : null
      }
    </div>
  )
}

Post.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    content: PropTypes.string,
    createdOn: PropTypes.string,
    likes: PropTypes.number,
    dislikes: PropTypes.number,
    author: PropTypes.string,
  }),
  onLike: PropTypes.func,
  onDislike: PropTypes.func,
};