import { useContext, useEffect, useState } from "react";
import { deletePost, getAllPosts, getCommentsCount, getPostById } from "../../services/post.service";
import { Link, useSearchParams } from "react-router-dom";
import { likeCount } from '../../services/post.service'; // replace with the actual path
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FilterMatchMode } from "primereact/api";
import { InputText } from "primereact/inputtext";
import { FiSearch } from "react-icons/fi";
import { AppContext } from '../../context/AppContext'
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin6Line } from "react-icons/ri";
import { GoShareAndroid } from "react-icons/go";
import toast from "react-hot-toast";
import 'primereact/resources/themes/lara-light-indigo/theme.css'
import './AllPosts.css';
import Modal from "../../components/Modal/Modal";


export default function AllPosts() {
  const { userData } = useContext(AppContext);
  const [posts, setPosts] = useState([]);
  const [likesCounts, setLikesCounts] = useState({});
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [showModal, setShowModal] = useState(false);
  // const [comments, setComments] = useState([]);
  // const [searchParams, setSearchParams] = useSearchParams();
  // const search = searchParams.get('search') || '';
  // const setSearch = (value) => {
  //   setSearchParams({ search: value });
  // };

  const toggleModal = (postId) => {
    setShowModal(!showModal);
  }

  useEffect(() => {
    getAllPosts().then(setPosts);
  }, [posts]);

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


  const formatDateType = (post) => {
    const fixedDate = new Date(post.createdOn);

    return fixedDate.toLocaleDateString('bg-BG');
  }

  const makeTitleALink = (post) => {
    const link = <Link to={`/posts/${post.id}`} > {post.title}</Link >

    return link;
  }

  const footer = (
    <>
      <div className="d-flex justify-content-center mt-2">
        <h5>{`Total posts: ${posts ? posts.length : 0}`}</h5>
      </div>
    </>
  )

  // const deleteSinglePost = async (postId) => {
  //   setShowModal(true);
  //   try {
  //     await deletePost(postId);
  //     toast.success('Post successfully deleted');

  //   } catch (error) {
  //     toast.error(error.code);
  //   }
  // };

  const setButtons = (post) => {
    return userData.username === post.author ? (
      <div className="justify-content-center">
        <CiEdit className="edit-button" />
        <RiDeleteBin6Line onClick={() => toggleModal(post.id)} className="delete-button" />
        <GoShareAndroid className="share-button" />
        <Modal show={showModal} toggle={toggleModal} id={post.id}/>
      </div>
    ) : (<GoShareAndroid className="share-button" />
    )
  }
  
  return (
    <>
      <div className="table">
        <h1>All posts</h1>
        <h2></h2>
        <div className="search-wrapper">
          <FiSearch />
          <InputText id='all-posts-searchbar' type='search' onInput={(e) =>
            setFilters({
              global: { value: e.target.value, matchMode: FilterMatchMode.CONTAINS },
            })
          } />
        </div>
        < DataTable value={posts} className="table-data"
          paginator rows={10} rowsPerPageOptions={[10, 25, 50]}
          sortMode="multiple" footer={footer} filters={filters} removableSort
        >
          <Column className="column title-column" field='title' header='Post title' body={makeTitleALink} sortable />
          <Column className="column" field='' header='categories' sortable />
          <Column className="column date-column" field='createdOn' header='Created on' body={formatDateType} sortable />
          <Column className="column" field='likes' header='Likes' body={(rowData) => likesCounts[rowData.id]} sortable />
          <Column className="column" field='commentsCount' header='Comments' sortable />
          <Column className="column action-column" header='Actions' body={setButtons} />
        </DataTable>
      </div >
    </>
  );
}




// import { useContext, useEffect, useState } from "react";
// import { getAllPosts } from "../../services/post.service";
// import PostPreview from "../../components/PostPreview/PostPreview";
// import { useSearchParams } from "react-router-dom";
// import { AppContext } from "../../context/AppContext";

// export default function AllPosts() {
//   const [posts, setPosts] = useState([]);
//   const [searchParams, setSearchParams] = useSearchParams();
//   // const [filters, setFilters] = useState({
//   //   global: { value: null, matchMode: FilterMatchMode.CONTAINS },
//   // })

//   const search = searchParams.get('search') || '';

//   const setSearch = (value) => {
//     setSearchParams({ search: value });
//   };

//   useEffect(() => {
//     getAllPosts(search).then(setPosts);

//   }, [search]);


//   return (
// <div>
//   <h1>All posts</h1>
//   <label htmlFor="search">Search </label>
//   <input value={search} onChange={e => setSearch(e.target.value)} type="text" name="search" id="search" /><br />
//   {posts.map((post) => (
//     <PostPreview
//       key={post.id}
//       post={{
//         ...post,
//         likes: typeof post.likes === 'number' ? post.likes : 0,
//         dislikes: typeof post.dislikes === 'number' ? post.dislikes : 0,
//       }}
//     />
//   ))}
// </div>
//   );
// }

{/* // <div> */ }
//   {posts.map((post) => <Post key={post.id} post={post}
//     onLike={() => handleLike(post.id)} onDislike={() => handleDislike(post.id)} />
//   )}
// </div>
