import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import Button from '../Button/Button';

export default function PostPreview({ post }) {
  const navigate = useNavigate();
  const { userData } = useContext(AppContext);

  return (
    <div className="post">
      <h4>{post.title}
        <p>Likes: {post.likes}</p>
        <p>Dislikes: {post.dislikes}</p>
      </h4>
      <p>{post.content}</p>
      <p>{new Date(post.createdOn).toLocaleDateString('bg-BG')}</p>
      <Button onClick={() => navigate(`/posts/${post.id}`)}>View</Button>
      {userData.username === post.author ? (<Button onClick={() => { }}>Edit</Button>) : null}
    </div>
  )
}

PostPreview.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    content: PropTypes.string,
    createdOn: PropTypes.string,
    likes: PropTypes.number,
    dislikes: PropTypes.number,
    author: PropTypes.string,
  }),
};