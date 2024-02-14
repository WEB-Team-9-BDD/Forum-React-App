import { useEffect, useState } from "react";
import { getAllPosts, getPostById } from "../../services/post.service";
import { Link, useSearchParams } from "react-router-dom";
import { likePost, dislikePost } from '../../services/post.service'; // replace with the actual path
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FilterMatchMode } from "primereact/api";
import { InputText } from "primereact/inputtext";
import { FiSearch } from "react-icons/fi";
import 'primereact/resources/themes/lara-light-blue//theme.css'
import './AllPosts.css';



export default function AllPosts() {
  const [posts, setPosts] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },

  })

  const search = searchParams.get('search') || '';

  const setSearch = (value) => {
    setSearchParams({ search: value });
  };

  useEffect(() => {
    getAllPosts(search).then(setPosts);

  }, [search]);

  const handleLike = async (id) => {
    await likePost(id);
    const updatedPost = await getPostById(id);
    setPosts(posts.map(post => post.id === id ? updatedPost : post));
  };

  const handleDislike = async (id) => {
    await dislikePost(id);
    const updatedPost = await getPostById(id);
    setPosts(posts.map(post => post.id === id ? updatedPost : post));
  };


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
  // const commentsCount = (post) =>{
  //   const count = post.comments;
  //   // console.log(post);
  //   return count;
  // }

  return (
    <div className="table">
      <h1>All posts</h1>

      <div className="search-wrapper">
        <FiSearch />
        <InputText type='search' onInput={(e) =>
          setFilters({
            global: { value: e.target.value, matchMode: FilterMatchMode.CONTAINS },
          })
        } />
      </div>
      < DataTable value={posts} tableStyle={{ minWidth: '40rem' }}
        paginator rows={10} rowsPerPageOptions={[5, 10, 25, 50]}
        sortMode="multiple" footer={footer} filters={filters} removableSort
      >
        <Column className="column title-column" field='title' header='Title' body={makeTitleALink} sortable />
        <Column className="column" field='' header='categories' sortable />
        <Column className="column" field='createdOn' header='Created on' body={formatDateType} sortable />
        <Column className="column" field='author' header='Author' sortable />
        <Column className="column" field='likes' header='Likes' sortable />
        <Column className="column" field='comments' header='Comments' sortable />
        <Column className="column" field='' header='actions' />
      </DataTable>

    </div >

  );
}

{/* // <div> */ }
//   {posts.map((post) => <Post key={post.id} post={post}
//     onLike={() => handleLike(post.id)} onDislike={() => handleDislike(post.id)} />
//   )}
// </div>
