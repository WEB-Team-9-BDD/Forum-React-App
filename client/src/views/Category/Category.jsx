import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { getPostsByCategory } from "../../services/post.service";
import PostPreview from '../../components/PostPreview/PostPreview'




export default function PostsByCategory() {    
    const { category } = useParams();
    const [posts, setPosts] = useState([]);
  
    useEffect(() => {
        const fetchPosts = async () => {
          try {
            const postsByCategory = await getPostsByCategory(category);
            console.log(postsByCategory); // log the data
            setPosts(postsByCategory);
          } catch (error) {
            console.error(error); // log any errors
          }
        };
      
        fetchPosts();
      }, [category]);
  
    return (
      <div>
        {posts.map(post => (
          <PostPreview key={post.id} post={post} />
        ))}
      </div>
    );
}

