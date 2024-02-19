import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import Button from '../Button/Button';
import './PostPreview.css'

export default function PostPreview({ post }) {
  const navigate = useNavigate();
  const { userData } = useContext(AppContext);



  return (
    <div className="post-preview">
      <div className='post-preview-title'>
        <Link to={`/posts/${post.id}`}>{post.title} </Link>
      </div>
      <div className='post-preview-content'>
        <p>{post.content}</p>
      </div>
      <div className='post-preview-details'>
      <Link to={`/posts/${post.id}/category/${post.category}`}>{post.category} </Link>
      <p>{new Date(post.createdOn).toLocaleDateString('bg-BG')}</p>
      
      </div>
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
    category: PropTypes.string,
  }),
};