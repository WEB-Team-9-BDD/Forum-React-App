import './Home.css'
import { useEffect, useState, useContext } from 'react';
import { getAllPosts, getCommentsCount, postCount } from '../../services/post.service';
import { usersCount } from '../../services/users.service';
import { AppContext } from '../../context/AppContext';
import HomePostPreview from './HomePostPreview';

export default function Home() {
    const [posts, setPosts] = useState([]);
    const [countUsers, setCountUsers] = useState(0);
    const [countPosts, setCountPosts] = useState(0);
    const { user } = useContext(AppContext);

    useEffect(() => {
        const fetchPosts = async () => {
            const allPosts = await getAllPosts();
            for (let currentPost of allPosts) {
                currentPost.commentsCount = await getCommentsCount(currentPost.id);
            }
            setPosts(allPosts);
        };
        fetchPosts();
    }, []);

    useEffect(() => {
        const checkLoginStatus = async () => {
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
    
    const lastTenPosts = posts.slice(-10).reverse();
    
    return (
        <div className="home-page">
            <div className="title" aria-hidden="true">
                <h1>Self Room</h1>
                <p className="moto">Grow with us and help us growing</p>
                </div>
            <div className="not-logged-int">
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
                                <HomePostPreview
                                key={post.id}
                                post={{
                                  ...post
                                }}
                              />
                        ))}
                    </div>
                </div>
                <div className="mostCommented">
                    <div>
                        <h2>Most Commented Posts</h2>
                        {mostCommentedPosts.map(post => (
                                <HomePostPreview
                                key={post.id}
                                post={{
                                  ...post,
                                }}
                              />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
