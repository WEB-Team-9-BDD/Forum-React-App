import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { addPost } from '../../services/post.service';
import Button from '../../components/Button/Button';
import { postCategories } from '../../constants/postCategories';

export default function CreatePost() {
  const { userData } = useContext(AppContext);
  const [post, setPost] = useState({
    title: '',
    content: '',
    category: 'Freestyle',
    tags: [],
  });

  const [isPostCreated, setIsPostCreated] = useState(false);

  const categories = postCategories.map(category => category.title);

  const updatePost = (value, key) => {
    setPost({
      ...post,
      [key]: value,
    });
  };

  const createPost = async () => {
    event.preventDefault();
    if (post.title.length < 16 || post.title.length > 64) {
      return alert('Title must be between 16 and 64 symbols.');
    }
    if (post.content.length < 32 || post.content.length > 8192) {
      return alert('Content must be between 32 and 8192 symbols.');
    }
  
    
    const category = post.category || 'Freestyle';
  
    await addPost(userData.username, post.title, post.content, category);

  setPost({
    title: '',
    content: '',
    category: 'Freestyle', // reset category to default
    
  });
  
  setIsPostCreated(true);  
  

  }


  useEffect(() => {
    if (isPostCreated) {
      alert(`${post.title} created successfully`);
      setIsPostCreated(false);
    }
  }, [isPostCreated, post.title]);

  return (
    <div>
    <div>New post</div>
    <label htmlFor="input-title"> Title:</label>
    <input value={post.title} onChange={e => updatePost(e.target.value, 'title')} type='text' name='input-title' id='input-title'/> <br/>
    <label htmlFor="input-content"> Content:</label><br/>
    <textarea value={post.content} onChange={e => updatePost(e.target.value, 'content')} name='input-content' id='input-content' cols='30' rows="10" ></textarea><br/><br/>
    <label htmlFor="input-category"> Category:</label><br/>
    <select id="input-category" value={post.category} onChange={e => updatePost(e.target.value, 'category')}>
      {categories.map((category) => (
        <option key={category} value={category}>
          {category}
        </option>
      ))}
    </select><br/><br/>
    
    <br/><br/>
    <Button onClick={createPost}>New Post+</Button>
    </div>
  )
}
