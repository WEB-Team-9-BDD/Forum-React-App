import { useContext, useEffect, useState } from "react";
import { getAllPosts, getPostById } from "../../services/post.service";
import Post from "../../components/Post/Post";
import { useSearchParams } from "react-router-dom";
import { likePost, dislikePost } from '../../services/post.service'; // replace with the actual path
import { AppContext } from "../../context/AppContext";

export default function AllPosts() {
  const { user, userData, setAppState } = useContext(AppContext);
  const [posts, setPosts] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get('search') || '';

  const setSearch = (value) => {
    setSearchParams({ search: value });
  };

  useEffect(() => {
    getAllPosts(search).then(setPosts);


  }, [search]);

  const handleLike = async (id) => {
    await likePost(id);
    const updatedPost = await getPostById(id);
    setPosts(posts.map(post => post.id === id ? updatedPost : post));
  };
  
  const handleDislike = async (id) => {
    await dislikePost(id);
    const updatedPost = await getPostById(id);
    setPosts(posts.map(post => post.id === id ? updatedPost : post));
  };


  return (
    <div>
      <h1>All posts</h1>
      <label htmlFor="search">Search </label>
      <input value={search} onChange={e => setSearch(e.target.value)} type="text" name="search" id="search" /><br />
      {posts.map((post) => <Post key={post.id} post={post} 
      onLike={() => handleLike(post.id)} onDislike={() => handleDislike(post.id)} />
      )}
    </div>
  );
}