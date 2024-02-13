import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPostById, addCommentToPost, getCommentsByPostId } from '../../services/post.service';
import Post from '../../components/Post/Post';
import { likePost, dislikePost } from '../../services/post.service';
import { AppContext } from '../../context/AppContext';

export default function SinglePost() {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const { id } = useParams();
  const { userData} = useContext(AppContext)

  useEffect(() => {
    getPostById(id).then(setPost);
    getCommentsByPostId(id).then(setComments);
  }, [id]);

  const handleLike = async () => {
    await likePost(id);
    const updatedPost = await getPostById(id);
    setPost(updatedPost);
  };

  const handleDislike = async () => {
    await dislikePost(id);
    const updatedPost = await getPostById(id);
    setPost(updatedPost);
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
    getCommentsByPostId(id).then(setComments);
  };

  return (
    <div>
      <h1>Single Post</h1>
      {post && (
        <Post 
          post={post} 
          onLike={handleLike} 
          onDislike={handleDislike} 
        />
      )}
      <form onSubmit={handleCommentSubmit}>
        <input type="text" value={comment} onChange={handleCommentChange} placeholder="Add a comment" />
        <button type="submit">Submit</button>
      </form>
      <div>
        <h2>Comments</h2>
        {comments.map((comment) => (
          <div key={comment.id}>
            <p>{comment.author}: {comment.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
