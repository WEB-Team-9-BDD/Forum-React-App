import PropTypes from 'prop-types';
import './Post.css';
import Button from '../Button/Button';
import { useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect, useCallback } from 'react';
import { AppContext } from '../../context/AppContext';
import { deletePost } from '../../services/post.service';
import toast from "react-hot-toast";
import { likePost, dislikePost } from '../../services/post.service';
import { SlLike, SlDislike } from "react-icons/sl";

export default function Post({ post }) {
  const navigate = useNavigate();
  const { userData } = useContext(AppContext);
  const [updating, setUpdating] = useState(false);
  const [likeActive, setLikeActive] = useState(false);
  const [dislikeActive, setDislikeActive] = useState(false);

  useEffect(() => {
    setLikeActive(post.likedBy.includes(userData.username));
    setDislikeActive(post.dislikedBy.includes(userData.username));
  }, [post, userData.username]);

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
  const handleLike = useCallback(async () => {
    if (updating) return;
    setUpdating(true);
    if (dislikeActive) {
      await dislikePost(userData.username, post.id);
      setDislikeActive(false);
    }
    await likePost(userData.username, post.id);
    setLikeActive(!likeActive);
    setUpdating(false);
  }, [userData.username, post.id, likeActive, dislikeActive, updating]);

  const handleDislike = useCallback(async () => {
    if (updating) return;
    setUpdating(true);
    if (likeActive) {
      await likePost(userData.username, post.id);
      setLikeActive(false);
    }
    await dislikePost(userData.username, post.id);
    setDislikeActive(!dislikeActive);
    setUpdating(false);
  }, [userData.username, post.id, likeActive, dislikeActive, updating]);

  return (
    <div className="post">
      <h4>{post.title}
        <Button disabled={updating} onClick={handleLike}><SlLike className={likeActive ? 'like-active' : ''} /></Button>
        <Button disabled={updating} onClick={handleDislike}><SlDislike className={dislikeActive ? 'dislike-active' : ''}/></Button>
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
      {userData.username === post.author ? (<Button onClick={() => { }}>Edit</Button>) : null}
    </div>
  )
}

Post.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    content: PropTypes.string,
    createdOn: PropTypes.string,
    likedBy: PropTypes.array,
    dislikedBy: PropTypes.array,
    author: PropTypes.string,
  }),
};