import PropTypes from 'prop-types';
// import './Post.css';
import Button from '../Button/Button';
import { useNavigate } from 'react-router-dom';
// import { useContext } from 'react';
// import { AppContext } from '../../context/AppContext';

/**
 * 
 * @param {{ post: { id: string, title: string, content: string, createdOn: string, liked: boolean }, togglePostLike: function }} props 
 */
export default function Post({ post, onLike, onDislike, hasEditButton }) {
  const navigate = useNavigate();
  //   const { userData } = useContext(AppContext);

  const editPost = async () => {

  }


  return (
    <div className="post">
      <h4>{post.title}
        <Button onClick={onLike}>Like {post.likes}</Button>
        <Button onClick={onDislike}>Dislike {post.dislikes}</Button>
      </h4>
      <p>{post.content}</p>
      <p>{new Date(post.createdOn).toLocaleDateString('bg-BG')}</p>
      <Button onClick={() => navigate(`/posts/${post.id}`)}>View</Button>
      {hasEditButton ?
        (<Button onClick={() => { }}>Edit</Button>) : null}
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
  }),
  onLike: PropTypes.func,
  onDislike: PropTypes.func,
  hasEditButton: PropTypes.bool,
};