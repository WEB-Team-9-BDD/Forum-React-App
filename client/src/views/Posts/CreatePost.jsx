import { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { addPost, addTagToPost } from '../../services/post.service';
import Button from '../../components/Button/Button';
import { db } from '../../config/firebase-config';

export default function CreatePost() {
  const { userData } = useContext(AppContext);
  const [post, setPost] = useState({
    title: '',
    content: '',
    category: 'Category1',
    tags: [],
  });
  const [tags, setTags] = useState([]);
  const [tag, setTag] = useState ([''])
  const [isPostCreated, setIsPostCreated] = useState(false);

  const categories = ['Category1', 'Category2', 'Category3', 'Category4']

  const updatePost = (value, key) => {
    setPost({
      ...post,
      [key]: value,
    });
  };

  const addTag = (tag) => {
    if (tag) { // Only add the tag if it's not undefined
      const newTags = [...tags, tag];
      setTags(newTags);
      setPost({
        ...post,
        tags: newTags,
      });
    }
  };

  const handleTagChange = (index, event) => {
    if (index >= 0 && index < tags.length) { // Check if index is valid
      const newTags = [...tags];
      newTags[index] = event.target.value;
      setTags(newTags);
    }
  };

  const handleTagAdd = (tag) => {
    if (tag && tag.trim() !== '' && tags.length < 5) { // Add a check for empty string
      setTags([...tags, tag]);
      setTag(''); // Clear the input field
    } else if (!tag || tag.trim() === '') { // Add a check for empty string
      alert('Please enter a tag.');
    } else {
      alert('You can only add up to 5 tags.');
    }
  };

  const handleTagRemove = (index) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    setTags(newTags);
  };




  const createPost = async () => {
    event.preventDefault();
    if (post.title.length < 16 || post.title.length > 64) {
      return alert('Title must be between 16 and 64 symbols.');
    }
    if (post.content.length < 32 || post.content.length > 8192) {
      return alert('Content must be between 32 and 8192 symbols.');
    }
  
    // If no category is selected, use the default category
    const category = post.category || 'Category1';
  
    const newPostRef = await addPost(userData.username, post.title, post.content, category, tags);
  const postId = newPostRef.key; // Extract the ID from the Reference object

  

  for (let tag of tags) {
    if (tag) { // Only process the tag if it's not empty or undefined
      await addTag(tag);
      const { tagIsValid, tagExists, finalTag } = await addTagToPost(postId, tag);

      if (!tagIsValid) {
        alert(`Tag "${tag}" is invalid.`);
        continue;
      }
      if (!tagExists) {
        alert(`Tag "${tag}" was not found in the database and has been created.`);
      }      
    }
  }


  setPost({
    title: '',
    content: '',
    category: 'Category1', // reset category to default
    tags: [], // reset tags
  });
  
  setIsPostCreated(true);

  window.location.reload();

  // setTags([])
  }

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
    <label htmlFor="input-tags"> Tags:</label><br/>
{tags.map((tag, index) => (
  <div className="tag-input-row" key={index}>
    <input 
      type="text" 
      name='input-tags'
      id={`input-tag-${index}`}
      value={tag} 
      onChange={event => handleTagChange(index, event)}
    />
    <button onClick={() => handleTagRemove(index)}>Remove Tag</button>
  </div>
))}
<div className="tag-input-row">
  <input 
    type="text" 
    name='input-tags'
    id={`input-tag-new`}
    value={tag} 
    onChange={event => setTag(event.target.value)}
    onKeyDown={event => {
      if (event.key === 'Enter') {
        event.preventDefault(); 
        handleTagAdd(tag);
      }
    }}
  />
  <button onClick={() => handleTagAdd(tag)}>Add Tag</button>
</div>

    <br/><br/>
    <Button onClick={createPost}>New Post+</Button>
    </div>
  )
}
