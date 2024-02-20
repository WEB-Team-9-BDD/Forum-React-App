import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { getPostsByCategory } from "../../services/post.service";
import PostPreview from '../../components/PostPreview/PostPreview';
import './Category.css';
import { postCategories } from "../../constants/postCategories";

export default function PostsByCategory() {
  const { category } = useParams();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsByCategory = await getPostsByCategory(category);
        setPosts(postsByCategory);
      } catch (error) {
        console.error(error); // log any errors
      }
    };

    fetchPosts();
  }, [category]);

  const categoryName = category.split('-').join(' ').toUpperCase();

  return (
    <div className="category-container">
      <div>
        <h1>{categoryName}</h1>
      </div>
      {posts.map(post => (
        <PostPreview key={post.id} post={post} />
      ))}
    </div>
  );
}

