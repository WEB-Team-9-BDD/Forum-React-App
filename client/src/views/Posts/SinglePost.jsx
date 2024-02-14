import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPostById, addCommentToPost, getCommentsByPostId } from '../../services/post.service';
import Post from '../../components/Post/Post';
import { AppContext } from '../../context/AppContext';

export default function SinglePost() {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const { id } = useParams();
  const { userData } = useContext(AppContext)

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
            <p>{comment.author}: {comment.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
