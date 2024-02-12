import { useEffect, useState } from "react";
import { getAllPosts } from "../../services/post.service";
import Post from "../../components/Post/Post";
import { useSearchParams } from "react-router-dom";
import { likePost, dislikePost } from '../../services/post.service'; // replace with the actual path

export default function AllPosts() {
  const [posts, setPosts] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get('search') || '';

  const setSearch = (value) => {
    setSearchParams({search: value});
  };

  useEffect(() => {
    getAllPosts(search).then(setPosts);
  }, [search]);

  const handleLike = async (id) => {
    const updatedPost = await likePost(id);
    setPosts(posts.map(post => post.id === id ? updatedPost : post));
  };

  const handleDislike = async (id) => {
    const updatedPost = await dislikePost(id);
    setPosts(posts.map(post => post.id === id ? updatedPost : post));
  };

  return (
    <div>
      <h1>All posts</h1>
        <label htmlFor="search">Search </label>
        <input value={search} onChange={e => setSearch(e.target.value)} type="text" name="search" id="search" /><br/>
        {posts.map((post) => (
          <Post key={post.id} post={post} onLike={() => handleLike(post.id)} onDislike={() => handleDislike(post.id)}/>
        ))}
    </div>
  );
}