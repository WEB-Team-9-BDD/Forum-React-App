import { useContext, useEffect, useState } from "react";
import { getAllPosts, getCommentsCount } from "../../services/post.service";
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


export default function AllPosts() {
  const { userData } = useContext(AppContext);
  const [posts, setPosts] = useState([]);
  const [likesCounts, setLikesCounts] = useState({});
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [showModal, setShowModal] = useState(false);

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

  const toggleModal = () => {
    setShowModal(!showModal);
  }

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

  const setButtons = (post) => {
    // console.log(post);
    return userData.username === post.author ? (
      <div className='table-action-buttons'>
        <CiEdit className="edit-button" />
        <SocialMediaShare id={post.id} />
        <RiDeleteBin6Line onClick={() => toggleModal(post.id)} className="delete-button" />
        <Modal show={showModal} toggle={toggleModal} id={post.id} />
      </div>
    ) : (<SocialMediaShare id={post.id} />
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
          paginator rows={10} rowsPerPageOptions={[10, 20, 50]}
          sortMode="multiple" footer={footer} filters={filters} removableSort
        >
          <Column className="column title-column" field='title' header='Post title' body={makeTitleALink} sortable />
          <Column className="column" field='' header='categories' sortable />
          <Column className="column date-column" field='createdOn' header='Created on' body={formatDateType} sortable />
          <Column className="column" field='likes' header='Likes' body={(rowData) => likesCounts[rowData.id]} sortable />
          <Column className="column" field='' header='Comments' sortable />
          <Column className="column action-column" header='Actions' body={setButtons} />
        </DataTable>
      </div >
    </>
  );
}
