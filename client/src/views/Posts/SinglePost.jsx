import { useCallback, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPostById, addCommentToPost, getCommentsByPostId, updateComment } from '../../services/post.service';
import Post from '../../components/Post/Post';
import Button from '../../components/Button/Button';
import { AppContext } from '../../context/AppContext';
import './SinglePost.css'

export default function SinglePost() {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const { id } = useParams();
  const { userData } = useContext(AppContext)
  const [editedComment, setEditedComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);

  useEffect(() => {
    fetchPostAndComments();
  }, [id]);

  const fetchPostAndComments = async () => {
    const fetchedPost = await getPostById(id);
    setPost(fetchedPost);
    const fetchedComments = await getCommentsByPostId(id);
    setComments(fetchedComments);
  };


  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
  
    if (comment.length < 1 || comment.length > 500) {
      return alert('Comment must be between 1 and 500 characters.');
    }
  
    await addCommentToPost(id, userData.username, comment);
    setComment('');
    await fetchPostAndComments();
  };


  const handleEditedCommentChange = (event) => {
    setEditedComment(event.target.value);
  };

  const handleEditComment = (commentId, commentContent) => {
    setEditingCommentId(commentId);
    setEditedComment(commentContent);
  };
  
  const handleCommentChangeSubmit = async (event) => {
    event.preventDefault();
  
    if (editedComment.length < 1 || editedComment.length > 500) {
      return alert('Comment must be between 1 and 500 characters.');
    }
  
    if (editingCommentId) {
      await updateComment(id, editingCommentId, userData.username, editedComment);
      setEditingCommentId(null);
      setEditedComment('');
      await fetchPostAndComments();
    }
  }

  return (
    <div>
      <h1>Single Post</h1>
      {post && <Post post={post} />}
      <form onSubmit={handleCommentSubmit}>
        <input type="text" value={comment} onChange={handleCommentChange} placeholder="Add a comment" />
        <button type="submit">Submit</button>
      </form>
      <div>
        <h2>Comments</h2>
        {comments.map((comment) => (
  <div key={comment.id}>
    {editingCommentId === comment.id ? (
      userData.username === comment.author ? (
        <form onSubmit={handleCommentChangeSubmit}>
          <input type="text" value={editedComment} onChange={handleEditedCommentChange} />
          <button type="submit">Change</button>
          <button type="button" onClick={() => setEditingCommentId(null)}>Cancel</button>
        </form>
      ) : (
        <p>You are not the author of this comment, so you cannot edit it.</p>
      )
    ) : (
      <p onDoubleClick={() => handleEditComment(comment.id, comment.comment)}>
        {comment.author}: {comment.comment}
      </p>
    )}
  </div>
))}
      </div>
    </div>
  );
}
 