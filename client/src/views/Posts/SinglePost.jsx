import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPostById } from '../../services/post.service';
import Post from '../../components/Post/Post';
import { likePost, dislikePost } from './path-to-your-functions'; // replace with the actual path

export default function SinglePost() {
  const [post, setPost] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    getPostById(id).then(setPost);
  }, [id]);

  const handleLike = async () => {
    const updatedPost = await likePost(id);
    setPost(updatedPost);
  };

  const handleDislike = async () => {
    const updatedPost = await dislikePost(id);
    setPost(updatedPost);
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
    </div>
  );
}
