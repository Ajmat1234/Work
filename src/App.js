import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Home from './Home'; // मान लिया कि Home.js अलग फाइल में है
import Blog from './Blog'; // मान लिया कि Blog.js अलग फाइल में है

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
      console.log("Fetching blogs from API...");
      const response = await fetch(`/api/post?_=${Date.now()}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      console.log("API Response:", response);
      const data = await response.json();
      console.log("API Data:", data);
      
      if (response.ok && Array.isArray(data)) {
        setBlogs(data);
        console.log('Blogs successfully loaded and set in state:', data);
      } else {
        setError('Failed to load blogs. Please try again.');
        console.error('Error loading blogs:', data.message || 'Unknown error');
      }
    } catch (error) {
      setError('An error occurred while fetching blogs.');
      console.error('Error fetching blogs:', error.message);
    } finally {
      setLoading(false);
      // टेस्टिंग के लिए 30 सेकंड, बाद में 5 मिनट (5 * 60 * 1000) करें
      setTimeout(fetchBlogs, 30 * 1000);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const renderedOutput = (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-lg p-4">
          <div className="max-w-3xl mx-auto flex flex-col gap-2">
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
                  {theme === 'light' ? '🌙' : '☀️'}
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Latest Blogs</h1>
              <div>
                <button
                  onClick={fetchBlogs}
                  className="px-2 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs mr-2"
                >
                  Refresh Blogs
                </button>
                <button
                  onClick={fetchBlogs}
                  className="px-2 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-xs"
                >
                  Force Refresh
                </button>
              </div>
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
