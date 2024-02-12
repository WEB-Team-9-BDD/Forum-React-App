import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { addPost } from '../../services/post.service';
import Button from '../../components/Button/Button';

export default function CreatePost() {
  const { userData } = useContext(AppContext);
  const [post, setPost] = useState({
    title: '',
    content: '',
  });

  const updatePost = (value, key) => {
    setPost({
      ...post,
      [key]: value,
    });
  };

  const createPost = async () => {
    if (post.title.length < 16 || post.title.length > 64) {
      return alert('Title must be between 16 and 64 symbols.');
    }
    if (post.content.length < 32 || post.content.length > 8192) {
      return alert('Content must be between 32 and 8192 symbols.');
    }

    await addPost(userData.handle, post.title, post.content);

    setPost({
      title: '',
      content: '',
    });
  };

  return (
    <div>
    <div>New post</div>
    <label htmlFor="input-title"> Title:</label>
    <input value={post.title} onChange={e => updatePost(e.target.value, 'title')} type='text' name='input-title' id='input-title'/> <br/>
    <label htmlFor="input-content"> Content:</label><br/>
    <textarea value={post.content} onChange={e => updatePost(e.target.value, 'content')} name='input-content' id='input-content' cols='30' rows="10" ></textarea><br/><br/>
    <Button onClick={createPost}>New Post+</Button>
    </div>
  )
}
