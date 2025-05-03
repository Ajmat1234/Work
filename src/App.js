import React, { useState } from 'react';
import { Routes, Route, Link, useParams } from 'react-router-dom';

// Home Page Component
function Home({ blogs }) {
  console.log("Home component rendering...");

  const renderedOutput = (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">Latest Blogs</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map((blog) => (
          <div
            key={blog.id}
            className="bg-white p-8 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
          >
            <Link to={`/blog/${blog.id}`} className="text-blue-600 hover:text-blue-800">
              <h2 className="text-xl font-semibold leading-6">{blog.title}</h2>
              <p className="text-gray-600 mt-3 leading-relaxed">{blog.content}</p>
              <p className="text-sm text-gray-500 mt-4">{blog.date}</p>
              {/* Tags */}
              <div className="mt-3 flex space-x-2">
                {blog.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              {/* Read More Button */}
              <button className="mt-4 text-blue-600 hover:underline">
                Read More
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );

  console.log("Home component rendered successfully!");
  return renderedOutput;
}

// Blog Post Page Component
function Blog({ blogs }) {
  console.log("Blog component rendering...");
  const { id } = useParams();
  console.log("Blog ID from useParams:", id);
  const blog = blogs.find((b) => Number(b.id) === Number(id));
  console.log("Found blog:", blog);

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      setComments([...comments, { text: newComment, date: new Date().toISOString().split('T')[0] }]);
      setNewComment('');
    }
  };

  const renderedOutput = (
    <div className="max-w-4xl mx-auto p-4">
      {blog ? (
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-blue-600">{blog.title}</h1>
          <p className="text-sm text-gray-500 mt-2">{blog.date}</p>
          <p className="text-gray-700 mt-4 leading-relaxed">{blog.content}</p>
          {/* Tags */}
          <div className="mt-3 flex space-x-2">
            {blog.tags.map((tag, index) => (
              <span
                key={index}
                className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
          {/* Comments Section */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900">Comments</h3>
            {comments.length > 0 ? (
              comments.map((comment, index) => (
                <div key={index} className="mt-4 p-4 bg-gray-100 rounded-lg">
                  <p className="text-gray-700">{comment.text}</p>
                  <p className="text-sm text-gray-500">{comment.date}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 mt-2">No comments yet. Be the first to comment!</p>
            )}
            <form onSubmit={handleCommentSubmit} className="mt-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full p-3 border rounded-lg"
                placeholder="Add a comment..."
                rows="3"
              />
              <button
                type="submit"
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Post Comment
              </button>
            </form>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">Blog not found!</p>
      )}
    </div>
  );

  console.log("Blog component rendered successfully!");
  return renderedOutput;
}

// API Route Component for Adding Posts
function AddPost({ addBlog }) {
  return (
    <div>
      <h1>API Route for Adding Posts</h1>
      <p>
        Send a POST request to <code>/api/post</code> with a JSON body containing the blog details.
      </p>
      <p>
        Example: <code>{`{"id": 3, "title": "New Post", "content": "Content here...", "date": "2025-05-01", "tags": ["Tech"]}`}</code>
      </p>
    </div>
  );
}

// Main App Component
function App() {
  console.log("App component rendering...");
  const [theme, setTheme] = useState('light');
  const [blogs, setBlogs] = useState([
    { id: 1, title: 'The Future of AI', content: 'AI is changing the world...', date: '2025-04-30', tags: ['AI', 'Tech'] },
    { id: 2, title: 'Web Dev Trends', content: 'Web dev is evolving fast...', date: '2025-04-29', tags: ['Web Dev', 'Tech'] },
  ]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
    console.log("Theme toggled to:", theme === 'light' ? 'dark' : 'light');
  };

  // Function to add a new blog post (for API route)
  const addBlog = (newBlog) => {
    setBlogs([...blogs, newBlog]);
  };

  const renderedOutput = (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
        <nav className="bg-white dark:bg-gray-800 shadow-lg p-4 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              My Blog
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400">
                Home
              </Link>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
              >
                {theme === 'light' ? '🌙' : '☀️'}
              </button>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home blogs={blogs} />} />
          <Route path="/blog/:id" element={<Blog blogs={blogs} />} />
          <Route path="/api/post" element={<AddPost addBlog={addBlog} />} />
        </Routes>
      </div>
    </div>
  );

  console.log("App component rendered successfully!");
  return renderedOutput;
}

export default App;
