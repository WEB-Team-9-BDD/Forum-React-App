import { Link } from 'react-router-dom';
import './Home.css'
import { useEffect, useState, useContext } from 'react';
import { getAllPosts, getCommentsCount, postCount, getPostById } from '../../services/post.service';
import { usersCount } from '../../services/users.service';
//import { isLoggedIn as isLoggedInService } from '../../services/auth.service';
import { AppContext } from '../../context/AppContext';

export default function Home() {
    const [posts, setPosts] = useState([]);
    const [countUsers, setCountUsers] = useState(0);
    const [countPosts, setCountPosts] = useState(0);
    //const [isLoggedIn, setIsLoggedIn] = useState(false);

    const { user } = useContext(AppContext);

    useEffect(() => {
        const fetchPosts = async () => {
            const posts = await getAllPosts();
            for (let post of posts) {
                post.commentsCount = await getCommentsCount(post.id);
            }
            setPosts(posts);
        };
        fetchPosts();
    }, []);

    useEffect(() => {
        const checkLoginStatus = async () => {
            // const loggedIn = await isLoggedInService();
            // setIsLoggedIn(!user);
            if (!user) {
                const users = await usersCount();
                const posts = await postCount();
                setCountUsers(users);
                setCountPosts(posts);
            }
        };
        checkLoginStatus();
    }, [user]);

    const mostCommentedPosts = [...posts].sort((a, b) => b.commentsCount - a.commentsCount).slice(0, 10);
    
    const lastTenPosts = posts.slice(-10);
    
    return (
        <div className="wrapper d-flex flex-column w-100">
            <div className="header d-flex justify-content-center align-items-center w-100">
                <h1>DDB Forum</h1>
                {!user && (
                    <div>
                        <p>Users: {countUsers}</p>
                        <p>Posts: {countPosts}</p>
                    </div>
                )}
            </div>
            <div className="content d-flex justify-content-around w-100">
                <div className="recent">
                    <div>
                        <h2>Recent Posts</h2>
                        {lastTenPosts.map(post => (
                            <Link key={post.id} to={`/post/${post.id}`} className="recent-link">{post.title}</Link>
                        ))}
                    </div>
                </div>
                <div className="mostCommented">
                    <div>
                        <h2>Most Commented Posts</h2>
                        {mostCommentedPosts.map(post => (
                            <Link key={post.id} to={`/post/${post.id}`} className="most-commented-posts-link">{post.title}</Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}