import './Home.css'
import { useEffect, useState, useContext } from 'react';
import { getAllPosts, getCommentsCount, postCount } from '../../services/post.service';
import { usersCount } from '../../services/users.service';
import { AppContext } from '../../context/AppContext';
import HomePostPreview from '../../components/HomePostPreview/HomePostPreview';

export default function Home() {
    const [posts, setPosts] = useState([]);
    const [countUsers, setCountUsers] = useState(0);
    const [countPosts, setCountPosts] = useState(0);
    const { user, userData } = useContext(AppContext);

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
            {user && userData && userData.isBlocked && (
                <div className="blocked">
                    <h4>Your account has been blocked!</h4>
                    <p className="block-text">You will not be able to edit or create any posts or comments.</p>
                </div>
            )}
            <div className="home-title">
                <h1 className="home-page-title">Self FoRoom</h1>
                <p className="moto">Grow with us and help us growing</p>
            </div>
            <div className="home-not-logged-in">
                {!user && (
                    <div>
                        <p>Users: {countUsers}</p>
                        <p>Posts: {countPosts}</p>
                    </div>
                )}
            </div>
            <div className="home-posts">
                <div className="recent">
                    <h2 className='recent-heading'> Recent Posts</h2>
                    {lastTenPosts.map(post => (
                        <HomePostPreview
                            key={post.id}
                            post={{
                                ...post
                            }}
                        />
                    ))}
                </div>
                <div className="most-commented">
                    <h2 className="most-commented-heading">Most Commented Posts</h2>
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
    );
}