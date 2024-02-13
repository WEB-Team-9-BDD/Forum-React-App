import { useContext, useEffect, useState } from "react";
import { getAllPosts } from "../../services/post.service";
import PostPreview from "../../components/PostPreview/PostPreview";
import { useSearchParams } from "react-router-dom";
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


  return (
<div>
  <h1>All posts</h1>
  <label htmlFor="search">Search </label>
  <input value={search} onChange={e => setSearch(e.target.value)} type="text" name="search" id="search" /><br />
  {posts.map((post) => (
    <PostPreview
      key={post.id}
      post={{
        ...post,
        likes: typeof post.likes === 'number' ? post.likes : 0,
        dislikes: typeof post.dislikes === 'number' ? post.dislikes : 0,
      }}
    />
  ))}
</div>
  );
}