import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { TbCategoryPlus } from "react-icons/tb";
import { SlLike, SlDislike } from "react-icons/sl";

import './PostPreview.css'
import { dislikeCount, likeCount } from '../../services/post.service';
import { postCategories } from '../../constants/postCategories';

export default function PostPreview({ post }) {
  const { user, userData } = useContext(AppContext);
  const [likes, SetLikes] = useState(0);
  const [dislikes, SetDislikes] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      const likesCount = await likeCount(post.id);
      SetLikes(likesCount)
      const disLikesCount = await dislikeCount(post.id);
      SetDislikes(disLikesCount);
    }
    fetchCounts();
  }, [post]);

  return (
    <div className="post-preview">
      <div className='post-preview-title'>
        <Link to={`/posts/${post.id}`}>{post.title} </Link>
      </div>
      <div className='post-preview-content'>
        <p>{post.content}</p>
      </div>
      <div className='post-preview-details'>
        <Link to={`/${post.category}`}><TbCategoryPlus />
          {post.category} </Link>
        <p>{new Date(post.createdOn).toLocaleDateString('bg-BG')}</p>
        <p><SlLike />{likes}</p>
        <p><SlDislike />{dislikes}</p>
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