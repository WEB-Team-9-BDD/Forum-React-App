import PropTypes from 'prop-types';
import './Post.css';
import Button from '../Button/Button';
import { useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect, useCallback } from 'react';
import { AppContext } from '../../context/AppContext';
import { deletePost, updatePost, editPostTitle, getPostById} from '../../services/post.service';
import toast from "react-hot-toast";
import { likePost, dislikePost, undislikePost, unlikePost } from '../../services/post.service';
import { SlLike, SlDislike } from "react-icons/sl";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin6Line } from "react-icons/ri";



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
  const [postState, setPost] = useState(post);

// Fetch post data when component mounts
useEffect(() => {
  const fetchPost = async () => {
    const fetchedPost = await getPostById(post.id); // Use getPostById instead of getPost
    setPost(fetchedPost);
  };

  fetchPost();
}, [post.id])
   
const updatePost = (updatedPost) => {
  setPost(updatedPost);
};

  const deleteSinglePost = async () => {
    try {
      await deletePost(post.id);
      toast.success('Post successfully deleted');
      navigate('/posts')
    } catch (error) {
      toast.error(error.code);
    }
  }
  const handleEditSubmit = async (event) => {
    event.preventDefault();
  
    if (editContent.length < 32 || editContent.length > 8192) {
      return alert('Post content must be between 1 and 500 characters.');
    }
  
    if (editedTitle.length < 16 || editedTitle.length > 64) {
      return alert('Post title must be between 16 and 64 characters.');
    }
  
    try {
      await updatePost(post.id, editContent);
      await editPostTitle(post.id, editedTitle);
      setPost({ ...postState, title: editedTitle, content: editContent });
      setEditing(false);
      setEditingTitle(false);
      toast.success('Post successfully updated');      
    } catch (error) {
      toast.error(error.code);
    }    
  };
  
  // Handler for changing edited post content
  const handleEditContentChange = (event) => {
    setEditContent(event.target.value);
  };
  
  // Handler for changing edited post title
  const handleEditedTitleChange = (event) => {
    setEditedTitle(event.target.value);
  };

  const handleEdit = () => {
    setEditing(true);
    setEditingTitle(true);}; 

  useEffect(() => {
    setLikeActive(post.likedBy.includes(userData.username));
    setDislikeActive(post.dislikedBy.includes(userData.username));
  }, [post, userData.username]);

  const handleLike = useCallback(async () => {
    if (updating) return;
    setUpdating(true);
    if (likeActive) {
      await unlikePost(userData.username, post.id);
      setLikeActive(false);
    } else {
      if (dislikeActive) {
        await undislikePost(userData.username, post.id);
        setDislikeActive(false);
      }
      await likePost(userData.username, post.id);
      setLikeActive(true);
    }
    setUpdating(false);
  }, [userData.username, post.id, likeActive, dislikeActive, updating]);
  
  const handleDislike = useCallback(async () => {
    if (updating) return;
    setUpdating(true);
    if (dislikeActive) {
      await undislikePost(userData.username, post.id);
      setDislikeActive(false);
    } else {
      if (likeActive) {
        await unlikePost(userData.username, post.id);
        setLikeActive(false);
      }
      await dislikePost(userData.username, post.id);
      setDislikeActive(true);
    }
    setUpdating(false);
  }, [userData.username, post.id, likeActive, dislikeActive, updating]);


  return (
    <div className="post">
      <div className="post-header">
        {editingTitle ? (
          userData.username === postState.author ? (
            <form onSubmit={handleEditSubmit}>
              <input type="text" value={editedTitle} onChange={handleEditedTitleChange} />
              <Button className='submit' type="submit">Save</Button>
              <Button className='cancel'type="button" onClick={() => setEditingTitle(false)}>Cancel</Button>
            </form>
          ) : (
            <p>You are not the author of this post, so you cannot edit it.</p>
          )
        ) : (
          <h2 onDoubleClick={() => setEditingTitle(true)}>{postState.title}</h2>
        )}
        <div className="post-actions">
          <Button className='like-button' disabled={updating} onClick={handleLike}><SlLike className={likeActive ? 'like-active' : ''} /></Button>
          <Button className='dislike-button' disabled={updating} onClick={handleDislike}><SlDislike className={dislikeActive ? 'dislike-active' : ''}/></Button>
        </div>
        <p>{new Date(postState.createdOn).toLocaleDateString('bg-BG')}</p>
      </div>
      <div className="post-container">
        {editing ? (
          userData.username === postState.author ? (
            <form onSubmit={handleEditSubmit}>
              <textarea value={editContent} onChange={handleEditContentChange} />
              <Button className='submit' type="submit">Save</Button>
              <Button className='cancel'type="button" onClick={() => setEditing(false)}>Cancel</Button>
            </form>
          ) : (
            <p>You are not the author of this post, so you cannot edit it.</p>
          )
        ) : (
          <p onDoubleClick={() => setEditing(true)}>{postState.content}</p>
        )}
      </div>
      {(userData.username === postState.author && !userData.isBlocked) || userData.isAdmin ?
        (<div className="button-post-container">
          {(userData.username === post.author && !userData.isBlocked) && <Button className="edit-post-comment" onClick={handleEdit}><CiEdit /></Button>}
          {(userData.isAdmin || userData.username === post.author && !userData.isBlocked)&& <Button className="delete-post-comment" onClick={deleteSinglePost}><RiDeleteBin6Line /></Button>}
        </div>) : null
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