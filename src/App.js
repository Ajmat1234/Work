import React, { useState } from 'react';
import { Routes, Route, Link, useParams } from 'react-router-dom';

// Home Page Component
function Home() {
  console.log("Home component rendering...");
  const blogs = [
    { id: 1, title: 'The Future of AI', content: 'AI is changing the world...', date: '2025-04-30' },
    { id: 2, title: 'Web Dev Trends', content: 'Web dev is evolving fast...', date: '2025-04-29' },
  ];

  const renderedOutput = (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">Latest Blogs</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <div key={blog.id} className="bg-white p-6 rounded-lg shadow-lg">
            <Link to={`/blog/${blog.id}`} className="text-blue-600 hover:text-blue-800">
              <h2 className="text-xl font-semibold">{blog.title}</h2>
              <p className="text-gray-600 mt-2">{blog.content}</p>
              <p className="text-sm text-gray-500 mt-4">{blog.date}</p>
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
function Blog() {
  console.log("Blog component rendering...");
  const { id } = useParams();
  console.log("Blog ID from useParams:", id);
  const blogs = [
    { id: 1, title: 'The Future of AI', content: 'AI is changing the world... (full content)', date: '2025-04-30' },
    { id: 2, title: 'Web Dev Trends', content: 'Web dev is evolving fast... (full content)', date: '2025-04-29' },
  ];
  const blog = blogs.find((b) => Number(b.id) === Number(id));
  console.log("Found blog:", blog);

  const renderedOutput = (
    <div className="max-w-4xl mx-auto p-4">
      {blog ? (
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-blue-600">{blog.title}</h1>
          <p className="text-sm text-gray-500 mt-2">{blog.date}</p>
          <p className="text-gray-700 mt-4">{blog.content}</p>
        </div>
      ) : (
        <p className="text-center text-gray-500">Blog not found!</p>
      )}
    </div>
  );

  console.log("Blog component rendered successfully!");
  return renderedOutput;
}

// Main App Component
function App() {
  console.log("App component rendering...");
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
    console.log("Theme toggled to:", theme === 'light' ? 'dark' : 'light');
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
          <Route path="/" element={<Home />} />
          <Route path="/blog/:id" element={<Blog />} />
        </Routes>
      </div>
    </div>
  );

  console.log("App component rendered successfully!");
  return renderedOutput;
}

export default App;
