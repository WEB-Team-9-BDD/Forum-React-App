import { useContext, useEffect, useState } from "react";
import { deletePost, editPostTitle, getAllPosts, postCommentsCounts } from "../../services/post.service";
import { Link, } from "react-router-dom";
import { likeCount } from '../../services/post.service'; // replace with the actual path
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FilterMatchMode } from "primereact/api";
import { InputText } from "primereact/inputtext";
import { FiSearch } from "react-icons/fi";
import { AppContext } from '../../context/AppContext'
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin6Line } from "react-icons/ri";
import 'primereact/resources/themes/lara-light-indigo/theme.css'
import './AllPosts.css';
import Modal from "../../components/Modal/Modal";
import SocialMediaShare from "../../components/SocialMediaShare/SocialMediaShare";
import { GiConfirmed } from "react-icons/gi";
import { GiCancel } from "react-icons/gi";
import toast from "react-hot-toast";


export default function AllPosts() {
  const { userData } = useContext(AppContext);
  const [posts, setPosts] = useState([]);
  const [likesCounts, setLikesCounts] = useState({});
  const [commentsCount, setCommentsCount] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [postToEdit, setPostToEdit] = useState(null);
  const [editedTitles, setEditedTitles] = useState({});

  const fullPostsData = posts.map((post) => {
    return {
      ...post, likes: likesCounts[post.id],
      comments: commentsCount[post.id]
    }
  });


  useEffect(() => {
    getAllPosts().then(setPosts);
  }, []);

  useEffect(() => {
    if (!posts) return;

    const fetchLikesCounts = async () => {
      const newLikesCounts = {};
      for (let post of posts) {
        newLikesCounts[post.id] = await likeCount(post.id);
      }
      setLikesCounts(newLikesCounts);
    };

    fetchLikesCounts();

  }, [posts]);

  useEffect(() => {
    if (!posts) return;

    const fetchCommentsCount = async () => {
      const newCommentsCount = {};
      for (let post of posts) {
        newCommentsCount[post.id] = await postCommentsCounts(post.id);
      }
      setCommentsCount(newCommentsCount);
    };

    fetchCommentsCount();
  }, [posts]);

  useEffect(() => {
    const allEditedTitles = {};
    posts.forEach(post => {
      allEditedTitles[post.id] = post.title;
    });
    setEditedTitles(allEditedTitles);
  }, [posts]);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const formatDateType = (post) => {
    const fixedDate = new Date(post.createdOn);

    return fixedDate.toLocaleDateString('bg-BG');
  };

  const makeTitleALink = (post) => {
    return <Link to={`/posts/${post.id}`} >{post.title}</Link >
  };

  const deleteSinglePost = async (postId) => {
    try {
      await deletePost(postId);
      toast.success('Post successfully deleted');
      const newPosts = fullPostsData.filter((post) => post.id !== postId);
      setPosts(newPosts);
      toggleModal();
    } catch (error) {
      toast.error(error.code);
    }
  };

  const setButtons = (post) => {
    return userData.username === post.author || userData.isAdmin ? (
      <div className='table-action-buttons'>
        {(userData.username === post.author && !userData.isBlocked) && <CiEdit className="edit-button" onClick={() => setPostToEdit(post.id)} />}
        <SocialMediaShare id={post.id} />
        {(userData.isAdmin || (userData.username === post.author && !userData.isBlocked)) && <RiDeleteBin6Line onClick={() => toggleModal(post.id)} className="delete-button" />}
        <Modal show={showModal} toggle={toggleModal} id={post.id} onDelete={deleteSinglePost} />
      </div>
    ) : (<SocialMediaShare id={post.id} />
    )
  };

  const renderLikes = (post) => {
    return post.likes;
  };

  const renderComments = (post) => {
    return post.comments;
  }

  const handleIsClicked = (post) => {

    return userData.username === post.author && post.id === postToEdit ?
      (
        <div className="edit-post-title">
          <input className="edit-title-input" key={post.id} type="text"
            value={editedTitles[post.id]}
            onChange={(e) => handleTitleEdit(e, post)}
          />
          <div className="edit-title-buttons" >
            <GiConfirmed className='edit-submit' type="submit" onClick={() => editTitle(post.id)} />
            <GiCancel className='edit-cancel' type="submit" onClick={() => setPostToEdit(null)} />
          </div>
        </div>
      )
      : (makeTitleALink(post));
  }

  const handleTitleEdit = (e, post) => {
    setEditedTitles({
      ...editedTitles, [post.id]: e.target.value
    })
  }

  const editTitle = async (postId) => {
    if (editedTitles[postId].length < 16 || editedTitles[postId].length > 64) {

      return toast.error('Title must be between 16 and 64 symbols.');
    } else {
      try {
        await editPostTitle(postId, editedTitles[postId]);
        toast.success('Post title updated successfully');
        setPostToEdit(null);
        setPosts(posts.map(post => {
          if (post.id === postId) {
            return { ...post, title: editedTitles[postId] };
          }
          return post;
        }))
      } catch (error) {
        toast.error(error.message);
      }
    }
  }

  const footer = (
    <>
      <div className="d-flex justify-content-center mt-2">
        <h5>{`Total posts: ${fullPostsData ? fullPostsData.length : 0}`}</h5>
      </div>
    </>
  );

  return (
    <>
      <div className="table">
        <h1>All posts</h1>
        <div className="search-wrapper">
          <FiSearch />
          <InputText id='all-posts-searchbar' type='search' onInput={(e) =>
            setFilters({
              global: { value: e.target.value, matchMode: FilterMatchMode.CONTAINS },
            })
          } />
        </div>
        < DataTable value={fullPostsData} className="table-data"
          paginator rows={10} rowsPerPageOptions={[10, 20, 50]}
          sortMode="multiple" sortField="title"
          footer={footer} filters={filters} removableSort
        >
          <Column className="column title-column" field='title' header='Post title'
            body={postToEdit ? handleIsClicked : makeTitleALink} sortable />
          <Column className="column category-column" field='category' header='categories' sortable />
          <Column className="column date-column" field='createdOn' header='Created on' body={formatDateType} sortable />
          <Column className="column likes-column" field='likes' header='Likes' body={renderLikes} sortable />
          <Column className="column comments-column" field='comments' header='Comments' body={renderComments} sortable />
          <Column className="column action-column" header='Actions' body={setButtons} />
        </DataTable>
      </div >
    </>
  );
}
