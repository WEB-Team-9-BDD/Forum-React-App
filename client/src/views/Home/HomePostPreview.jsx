import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export default function HomePostPreview({ post }) {

  return (
    <div className="post">
      <Link  key={post.id} to={`/posts/${post.id}`}>{post.title}</Link>
      <p>{new Date(post.createdOn).toLocaleDateString('bg-BG')}</p>
    </div>
  )
}

HomePostPreview.propTypes = {
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