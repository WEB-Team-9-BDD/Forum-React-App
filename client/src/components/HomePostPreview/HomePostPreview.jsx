import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './HomePostPreview.css';
import { getCommentsCount } from '../../services/post.service';
import { likeCount } from '../../services/post.service';
import { useEffect, useState } from 'react';

export default function HomePostPreview({ post }) {
  const [commentsCount, setCommentsCount] = useState(0);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      const comments = await getCommentsCount(post.id);
      const likes = await likeCount(post.id);
      setCommentsCount(comments);
      setLikesCount(likes);
    };
    fetchCounts();
  }, [post.id]);

  return (
    <div className="home-post">
      <Link className='home-post-title' key={post.id} to={`/posts/${post.id}`}>{post.title}</Link>
      <p className='home-post-date'>{new Date(post.createdOn).toLocaleDateString('bg-BG')}</p>
      <p className='home-post-comments'>Comments: {commentsCount.length=== 0 ? 0 : commentsCount}</p>
      <p className='home-post-likes'>Likes: {likesCount}</p>
    </div>
  )
}

HomePostPreview.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    createdOn: PropTypes.string,
    likes: PropTypes.number,
  }),
};