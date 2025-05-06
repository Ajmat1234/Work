import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useParams } from 'react-router-dom';

function Home({ blogs, fetchBlogs }) {
  console.log("Home component rendering...");

  const sharePost = (blog) => {
    const shareText = `${blog.title}\n${blog.content}\nCheck out this post on Ajmat's Blog!`;
    const shareUrl = window.location.origin + `/blog/${blog.id}`;
    if (navigator.share) {
      navigator.share({
        title: blog.title,
        text: shareText,
        url: shareUrl,
      }).catch((error) => console.error('Error sharing:', error));
    } else {
      navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      alert('Link copied to clipboard!');
    }
  };

  // Sort blogs by date in descending order (newest first)
  const sortedBlogs = [...blogs].sort((a, b) => new Date(b.date) - new Date(a.date));

  const renderedOutput = (
    <div className="max-w-3xl mx-auto p-4">
      {sortedBlogs.length > 0 ? (
        <div className="space-y-6">
          {sortedBlogs.map((blog) => (
            <div
              key={blog.id}
              className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
            >
              <Link to={`/blog/${blog.id}`} className="text-blue-600 hover:text-blue-800">
                <h2 className="text-lg font-semibold text-purple-600 dark:text-purple-400 mb-2">{blog.title}</h2>
                <div className="text-gray-700 dark:text-gray-300 leading-relaxed text-justify">
                  {blog.content.split('\n').map((line, index) => {
                    if (line.startsWith('**Question:')) {
                      return (
                        <p key={index} className="text-base font-semibold text-pink-600 dark:text-pink-400">
                          {line.replace('**Question:', '').replace('**', '').trim()}
                        </p>
                      );
                    } else if (line.startsWith('**Answer')) {
                      return (
                        <p key={index} className="text-gray-700 dark:text-gray-300 mt-2">
                          {line.replace(/^\*\*Answer \d+:\*\*/, '').trim()}
                        </p>
                      );
                    }
                    return null;
                  })}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">{blog.date}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {blog.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
              <div className="mt-3 flex justify-between">
                <Link to={`/blog/${blog.id}`} className="text-blue-600 hover:underline text-sm">
                  Read More
                </Link>
                <button
                  onClick={() => sharePost(blog)}
                  className="text-green-600 hover:underline text-sm"
                >
                  Share
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400">No blogs available.</p>
      )}
    </div>
  );

  console.log("Home component rendered successfully!");
  return renderedOutput;
}

function Blog({ blogs }) {
  console.log("Blog component rendering...");
  const { id } = useParams();
  console.log("Blog ID from useParams:", id);
  const blog = blogs.find((b) => Number(b.id) === Number(id));
  console.log("Found blog:", blog);

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      setLoadingComments(true);
      setError(null);
      try {
        const response = await fetch(`/api/post?blogId=${id}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        if (response.ok && Array.isArray(data)) {
          setComments(data);
          console.log('Comments loaded:', data);
        } else {
          setError('Failed to load comments.');
          console.error('Error loading comments:', data.message);
        }
      } catch (error) {
        setError('An error occurred while fetching comments.');
        console.error('Error fetching comments:', error);
      } finally {
        setLoadingComments(false);
      }
    };

    fetchComments();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      const comment = { text: newComment, date: new Date().toISOString().split('T')[0] };
      
      try {
        const response = await fetch('/api/post', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ blogId: id, comment }),
        });
        const data = await response.json();
        if (response.ok) {
          setComments((prevComments) => {
            if (prevComments.some(c => c.text === comment.text && c.date === comment.date)) {
              return prevComments;
            }
            return [...prevComments, comment];
          });
          setNewComment('');
        } else {
          console.error('Error saving comment:', data.message);
        }
      } catch (error) {
        console.error('Error saving comment:', error);
      }
    }
  };

  const sharePost = () => {
    const shareText = `${blog.title}\n${blog.content}\nCheck out this post on Ajmat's Blog!`;
    const shareUrl = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: blog.title,
        text: shareText,
        url: shareUrl,
      }).catch((error) => console.error('Error sharing:', error));
    } else {
      navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      alert('Link copied to clipboard!');
    }
  };

  const renderedOutput = (
    <div className="max-w-3xl mx-auto p-4">
      {blog ? (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">{blog.title}</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{blog.date}</p>
          <div className="leading-relaxed text-justify">
            {blog.content.split('\n').map((line, index) => {
              if (line.startsWith('**Question:')) {
                return (
                  <p key={index} className="text-base font-semibold text-pink-600 dark:text-pink-400">
                    {line.replace('**Question:', '').replace('**', '').trim()}
                  </p>
                );
              } else if (line.startsWith('**Answer')) {
                return (
                  <p key={index} className="text-gray-700 dark:text-gray-300 mt-2">
                    {line.replace(/^\*\*Answer \d+:\*\*/, '').trim()}
                  </p>
                );
              }
              return null;
            })}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {blog.tags.map((tag, index) => (
              <span
                key={index}
                className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
          <button
            onClick={sharePost}
            className="mt-3 text-green-600 hover:underline text-sm"
          >
            Share
          </button>
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Comments</h3>
            {loadingComments ? (
              <p className="text-gray-500 dark:text-gray-400 mt-2">Loading comments...</p>
            ) : error ? (
              <p className="text-red-500 mt-2">{error}</p>
            ) : comments.length > 0 ? (
              comments.map((comment, index) => (
                <div key={index} className="mt-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <p className="text-gray-700 dark:text-gray-300">{comment.text}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{comment.date}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 mt-2">No comments yet. Be the first to comment!</p>
            )}
            <form onSubmit={handleCommentSubmit} className="mt-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full p-3 border rounded-lg text-gray-900 dark:text-gray-900"
                placeholder="Add a comment..."
                rows="3"
              />
              <button
                type="submit"
                className="mt-2 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                Post Comment
              </button>
            </form>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400">Blog not found!</p>
      )}
    </div>
  );

  console.log("Blog component rendered successfully!");
  return renderedOutput;
}

function App() {
  console.log("App component rendering...");
  const [theme, setTheme] = useState('light');
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
    console.log("Theme toggled to:", theme === 'light' ? 'dark' : 'light');
  };

  const fetchBlogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/post', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (response.ok && Array.isArray(data)) {
        setBlogs(data);
        console.log('Blogs loaded:', data);
      } else {
        setError('Failed to load blogs. Please try again.');
        console.error('Error loading blogs:', data.message);
      }
    } catch (error) {
      setError('An error occurred while fetching blogs.');
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const renderedOutput = (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
        {/* Combined Navigation and Latest Blogs/Refresh Blogs Section */}
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-lg p-4">
          <div className="max-w-3xl mx-auto flex flex-col gap-2">
            {/* Navigation Bar */}
            <div className="flex justify-between items-center">
              <Link to="/" className="text-lg font-bold text-blue-600 dark:text-blue-400">
                Ajmat's Blog
              </Link>
              <div className="flex items-center space-x-4">
                <Link to="/" className="text-sm hover:text-blue-600 dark:hover:text-blue-400">
                  Home
                </Link>
                <button
                  onClick={toggleTheme}
                  className="p-1 rounded-full bg-gray-200 dark:bg-gray-700"
                >
                  {theme === 'light' ? 'ðŸŒ™' : 'â˜€ï¸'}
                </button>
              </div>
            </div>
            {/* Latest Blogs and Refresh Blogs */}
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Latest Blogs</h1>
              <button
                onClick={fetchBlogs}
                className="px-2 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs"
              >
                Refresh Blogs
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center mt-8">
            <p className="text-gray-500 dark:text-gray-400">Loading blogs...</p>
          </div>
        ) : error ? (
          <div className="text-center mt-8">
            <p className="text-red-500">{error}</p>
            <button
              onClick={fetchBlogs}
              className="mt-4 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              Retry
            </button>
          </div>
        ) : (
          <Routes>
            <Route path="/" element={<Home blogs={blogs} fetchBlogs={fetchBlogs} />} />
            <Route path="/blog/:id" element={<Blog blogs={blogs} />} />
          </Routes>
        )}
      </div>
    </div>
  );

  console.log("App component rendered successfully!");
  return renderedOutput;
}

export default App;
