import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useParams } from 'react-router-dom';

// Main App Component
function App() {
  const [theme, setTheme] = useState('light');

  // Toggle Dark/Light Mode
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // Home Page Component
  function Home() {
    const blogs = [
      {
        id: 1,
        title: 'The Future of AI',
        content: 'Artificial Intelligence is transforming the world...',
        date: '2025-04-30',
      },
      {
        id: 2,
        title: 'Web Development Trends',
        content: 'Modern web development is evolving rapidly...',
        date: '2025-04-29',
      },
    ];

    return (
      <div className="max-w-7xl mx-auto p-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white">
          Latest Blogs
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <Link to={`/blog/${blog.id}`}>
                <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400">{blog.title}</h2>
                <p className="text-gray-600 dark:text-gray-300 mt-2">{blog.content}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">{blog.date}</p>
              </Link>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Blog Post Page Component
  function Blog() {
    const { id } = useParams();
    const blogs = [
      {
        id: 1,
        title: 'The Future of AI',
        content: 'Artificial Intelligence is transforming the world... (full content here)',
        date: '2025-04-30',
      },
      {
        id: 2,
        title: 'Web Development Trends',
        content: 'Modern web development is evolving rapidly... (full content here)',
        date: '2025-04-29',
      },
    ];
    const blog = blogs.find((b) => b.id === parseInt(id));

    return (
      <div className="max-w-4xl mx-auto p-4">
        {blog ? (
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">{blog.title}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{blog.date}</p>
            <p className="text-gray-700 dark:text-gray-300 mt-4">{blog.content}</p>
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400">Blog not found!</p>
        )}
      </div>
    );
  }

  // Main Render
  return (
    <BrowserRouter>
      <div className={theme === 'dark' ? 'dark' : ''}>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
          {/* Navbar */}
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

          {/* Routes */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog/:id" element={<Blog />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
