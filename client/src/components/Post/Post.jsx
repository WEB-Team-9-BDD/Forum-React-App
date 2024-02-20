import PropTypes from 'prop-types';
import './Post.css';
import Button from '../Button/Button';
import { useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect, useCallback } from 'react';
import { AppContext } from '../../context/AppContext';
import { deletePost, updatePost, editPostTitle } from '../../services/post.service';
import toast from "react-hot-toast";
import { likePost, dislikePost } from '../../services/post.service';
import { SlLike, SlDislike } from "react-icons/sl";

export default function Post({ post }) {
  const navigate = useNavigate();
  const { userData } = useContext(AppContext);
  const [updating, setUpdating] = useState(false);
  const [likeActive, setLikeActive] = useState(false);
  const [dislikeActive, setDislikeActive] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [editedTitle, setEditedTitle] = useState(post.title);
  const [editingTitle, setEditingTitle] = useState(false);

  useEffect(() => {
    setLikeActive(post.likedBy.includes(userData.username));
    setDislikeActive(post.dislikedBy.includes(userData.username));
  }, [post, userData.username]);

  const deleteSinglePost = async () => {
    try {
      await deletePost(post.id);
      toast.success('Post successfully deleted');
      navigate('/posts')
    } catch (error) {
      toast.error(error.code);
    }
  }

  const handleEdit = () => {
    setEditing(true);
    setEditingTitle(true);
  };

  const handleTitleEditSubmit = async (event) => {    
    event.preventDefault();
    await editPostTitle(post.id, editedTitle);
    setEditingTitle(false);
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    try {
      await updatePost(post.id, editContent);
      setEditing(false);
    } catch (error) {
      console.error('Failed to update post:', error);
      // Show some error message to the user
    }
  };

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

  console.log(userData.username, post.author); // Check the username and author
  console.log(userData.isBlocked)

  return (
    <div className="post">
      <div className="post-header">
        {editingTitle ? (
          userData.username === post.author ? (
            <form onSubmit={handleTitleEditSubmit}>
              <input type="text" value={editedTitle} onChange={e => setEditedTitle(e.target.value)} />
              <Button type="submit">Save</Button>
              <Button type="button" onClick={() => setEditingTitle(false)}>Cancel</Button>
            </form>
          ) : (
            <p>You are not the author of this post, so you cannot edit it.</p>
          )
        ) : (
          <h2 onDoubleClick={() => setEditingTitle(true)}>{post.title}</h2>
        )}
        <div className="post-actions">
          <Button disabled={updating} onClick={handleLike}><SlLike className={likeActive ? 'like-active' : ''} /></Button>
          <Button disabled={updating} onClick={handleDislike}><SlDislike className={dislikeActive ? 'dislike-active' : ''}/></Button>
        </div>
        <p>{new Date(post.createdOn).toLocaleDateString('bg-BG')}</p>
      </div>
      <div className="post-container">
        {editing ? (
          userData.username === post.author ? (
            <form onSubmit={handleEditSubmit}>
              <textarea value={editContent} onChange={e => setEditContent(e.target.value)} />
              <button type="submit">Save</button>
              <button type="button" onClick={() => setEditing(false)}>Cancel</button>
            </form>
          ) : (
            <p>You are not the author of this post, so you cannot edit it.</p>
          )
        ) : (
          <p onDoubleClick={() => setEditing(true)}>{post.content}</p>
        )}
      </div>
      {(userData.username === post.author && !userData.isBlocked) || userData.isAdmin ?
        (<>
          {(!userData.isAdmin && userData.username === post.author && !userData.isBlocked) && <Button onClick={handleEdit}>Edit</Button>}
          {(userData.isAdmin || userData.username === post.author && !userData.isBlocked)&& <Button onClick={deleteSinglePost}>Delete</Button>}
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
    likedBy: PropTypes.array,
    dislikedBy: PropTypes.array,
    author: PropTypes.string,
    category: PropTypes.string,
  }),
};