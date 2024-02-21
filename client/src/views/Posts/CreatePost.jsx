import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { addPost } from '../../services/post.service';
import Button from '../../components/Button/Button';
import { postCategories } from '../../constants/postCategories';
import './CreatePost.css'
import ReactSelect from 'react-select';
import toast from 'react-hot-toast';

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
      return toast.error('Title must be between 16 and 64 symbols.');
    }
    if (post.content.length < 32 || post.content.length > 8192) {
      return toast.error('Content must be between 32 and 8192 symbols.');
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
      toast.success(`${post.title} created successfully`);
      setIsPostCreated(false);
    }
  }, [isPostCreated, post.title]);

  const options = categories.map(category => ({ value: category, label: category }));

  return (
    <div className='create-post-container'>
    <div className='create-post'>
    <label htmlFor="input-title-create"> Title:</label>
    <input className="input-title-create" value={post.title} onChange={e => updatePost(e.target.value, 'title')} type='text' name='input-title' id='input-title'/> <br/>
    <label htmlFor="input-content"></label><br/>
    <textarea className='crete-post-text' value={post.content} onChange={e => updatePost(e.target.value, 'content')} name='input-content' id='input-content' cols='30' rows="10" ></textarea><br/><br/>
    <label htmlFor="input-category"></label><br/>
    <div className="dropdown-container">
    <ReactSelect 
  className="category-select"
  value={options.find(option => option.value === post.category)}
  onChange={option => updatePost(option.value, 'category')}
  options={options}
  styles={{
    control: (provided) => ({
      ...provided,
      backgroundColor: 'rgba(0, 0, 0, 0.31)',
      color: 'white',
    }),
    menu: (provided) => ({
      ...provided,    
      backgroundColor: 'rgba(0, 0, 0, 0.31)',
      maxHeight: '40px',
      color: 'white',

      }),
    option: (provided) => ({
      ...provided,
      backgroundColor: 'rgba(0, 0, 0, 0.31)',
      color: 'white',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      overflow: 'hidden'
    }), 
     singleValue: (provided) => ({
      ...provided,
      color: 'white',
    }),
     placeholder: (provided) => ({
      ...provided,
      color: 'white',
    }),
  }}
/>
</div><br/><br/><br/>
    <div className="button-container">
    <Button className='new-post' onClick={createPost}>New Post+</Button>
    </div>
    </div>
    </div>
  )
}
