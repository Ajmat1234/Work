import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Head from 'next/head';

// About Us Component
function AboutUs() {
  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-purple-400 mb-2">About Us</h1>
      <p className="text-gray-300 leading-relaxed text-justify">
        Welcome to Knowtivus! <br />
        I'm Ajmat from Jharkhand, India. <br /><br />
        This website is my personal project where I share informational blogs to help students, curious readers, and professionals. I use modern AI tools to assist in creating content, but I personally check and publish each blog to make sure it's helpful and meaningful. <br /><br />
        I believe in sharing knowledge freely. If you ever find any information on this site that seems incorrect, I humbly request you to do your own research and let me know through comments — so I can correct it and we can learn together.
      </p>
    </div>
  );
}

// Privacy Policy Component
function PrivacyPolicy() {
  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-purple-400 mb-2">Privacy Policy</h1>
      <p className="text-gray-300 leading-relaxed text-justify">
        At Knowtivus, your privacy is extremely important. <br /><br />
        This is a non-login website, which means I do not collect, store, or share any personal information about visitors. All users are anonymous — I do not know who visits my site, and no data about you is saved on my end. <br /><br />
        I do not use any public or private user data. I also do not use cookies or third-party tracking tools. <br /><br />
        The only interaction is through comments — and I read those to learn and improve the blog. You can comment freely; your identity remains unknown to me. <br /><br />
        There is absolutely no risk to your privacy when using this website.
      </p>
    </div>
  );
}

// Disclaimer Component
function Disclaimer() {
  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-purple-400 mb-2">Disclaimer</h1>
      <p className="text-gray-300 leading-relaxed text-justify">
        All the content provided on Knowtivus is for informational and educational purposes only. <br /><br />
        While I try my best to share accurate and useful content, there may be occasional mistakes. I encourage all readers to do their own research before taking any action based on the content provided. <br /><br />
        I am not responsible for any kind of loss or damage caused by the information shared here. Your understanding, feedback, and suggestions are always welcome through the comment section. <br /><br />
        If you find any errors or misleading details, please let me know in the comments — I will gladly correct them. Learning is a journey, and I believe in growing together.
      </p>
    </div>
  );
}

// Contact Us Component
function ContactUs() {
  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-purple-400 mb-2">Contact Us</h1>
      <p className="text-gray-300 leading-relaxed text-justify">
        If you have any questions, feedback, or suggestions, feel free to reach out to me. <br /><br />
        Name: Ajmat <br />
        Email: <a href="mailto:hunterboyz73770@gmail.com" className="text-blue-400 hover:underline">hunterboyz73770@gmail.com</a> <br /><br />
        I read every email and try my best to respond as soon as possible. Thank you for visiting Knowtivus!
      </p>
    </div>
  );
}

// Home Component
function Home({ blogs, setBlogs, searchQuery, setSearchQuery, currentPage, totalBlogs, blogsPerPage, fetchBlogs, loading, error }) {
  const router = useRouter();
  const totalPages = Math.ceil(totalBlogs / blogsPerPage);

  const sharePost = (blog) => {
    const shareText = `${blog.title}\n${blog.content}\nCheck out this post on Knowtivus!`;
    const shareUrl = window.location.origin + `/blog/${blog.slug}`;
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

  const filteredBlogs = searchQuery
    ? blogs.filter((blog) =>
        (blog.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
         blog.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
         blog.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())))
      )
    : blogs;

  const sortedBlogs = [...filteredBlogs].sort((a, b) => {
    const dateTimeA = new Date(`${a.date || '1970-01-01'}T${a.time || '00:00:00'}`);
    const dateTimeB = new Date(`${b.date || '1970-01-01'}T${b.time || '00:00:00'}`);
    if (isNaN(dateTimeA.getTime()) && isNaN(dateTimeB.getTime())) return 0;
    if (isNaN(dateTimeA.getTime())) return 1;
    if (isNaN(dateTimeB.getTime())) return -1;
    return dateTimeB.getTime() - dateTimeA.getTime();
  });

  // Slice blogs for pagination
  const paginatedBlogs = sortedBlogs.slice(
    (currentPage - 1) * blogsPerPage,
    currentPage * blogsPerPage
  );

  const getRelatedPosts = (currentBlog) => {
    const otherBlogs = blogs.filter((blog) => blog.slug !== currentBlog.slug);
    if (otherBlogs.length <= 3) return otherBlogs;
    const shuffled = otherBlogs.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  };

  const handlePageChange = (newPage) => {
    router.push(`/?page=${newPage}`, undefined, { shallow: true });
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <Head>
        <title>{`Knowtivus - Latest Blogs | Page ${currentPage}`}</title>
        <meta name="description" content="Explore the latest educational and informational blogs on Knowtivus. Topics include technology, history, science, and more." />
        <meta name="keywords" content="blogs, education, knowledge, technology, history, science" />
        <meta name="robots" content="index, follow" />
      </Head>

      {loading ? (
        <p className="text-center text-gray-400">Loading blogs...</p>
      ) : error ? (
        <div className="text-center">
          <p className="text-red-400">{error}</p>
          <button
            onClick={() => fetchBlogs(currentPage)}
            className="mt-4 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-500 text-sm"
          >
            Retry
          </button>
        </div>
      ) : paginatedBlogs.length > 0 ? (
        <div className="space-y-6">
          {paginatedBlogs.map((blog) => (
            <div
              key={blog.id || blog.title}
              className="bg-gray-800 p-5 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
            >
              <Link href={`/blog/${blog.slug}`} prefetch={true}>
                <a className="text-blue-400 hover:text-blue-300">
                  <h2 className="text-lg font-semibold text-purple-400 mb-2">
                    {blog.title || 'Untitled Post'}
                  </h2>
                  <div className="text-gray-300 leading-relaxed text-justify">
                    {blog.content && blog.content.split('\n').map((line, index) => {
                      if (line.startsWith('Question:')) {
                        return (
                          <p key={index} className="text-base font-semibold text-pink-400">
                            {line.replace('Question:', '').trim()}
                          </p>
                        );
                      } else if (line.startsWith('Answer')) {
                        return (
                          <p key={index} className="text-gray-300 mt-2">
                            {line.replace(/Answer \d+:/, '').trim()}
                          </p>
                        );
                      }
                      return null;
                    })}
                  </div>
                  <p className="text-xs text-gray-400 mt-3">
                    {blog.date} {blog.time ? `at ${blog.time}` : ''}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {blog.tags && blog.tags.length > 0 ? (
                      blog.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="text-xs bg-blue-900 text-blue-300 px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-400">No tags</span>
                    )}
                  </div>
                </a>
              </Link>
              <div className="mt-3 flex justify-between">
                <Link href={`/blog/${blog.slug}`} prefetch={true}>
                  <a className="text-blue-400 hover:underline text-sm">Read More</a>
                </Link>
                <button
                  onClick={() => sharePost(blog)}
                  className="text-green-400 hover:underline text-sm"
                >
                  Share
                </button>
              </div>
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-gray-300">Read More Posts:</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {getRelatedPosts(blog).length > 0 ? (
                    getRelatedPosts(blog).map((relatedBlog) => (
                      <Link
                        key={relatedBlog.id || relatedBlog.title}
                        href={`/blog/${relatedBlog.slug}`}
                        prefetch={true}
                      >
                        <a className="text-blue-400 hover:underline text-sm">
                          {relatedBlog.title || 'Untitled Post'}
                        </a>
                      </Link>
                    ))
                  ) : (
                    <p className="text-xs text-gray-400">No other posts available.</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400">
          {searchQuery ? 'No blogs match your search.' : 'No blogs available.'}
        </p>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center gap-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg text-sm ${
              currentPage === 1
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-500'
            }`}
          >
            Previous
          </button>
          <span className="text-gray-300">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg text-sm ${
              currentPage === totalPages
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-500'
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

// Blog Component
function Blog({ blogs, slug }) {
  const blog = blogs.find((b) => b.slug === slug);
  const router = useRouter();

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(true);
  const [errorComments, setErrorComments] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      setLoadingComments(true);
      setErrorComments(null);
      try {
        const response = await fetch(`/api/post?blogId=${blog?.id}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        if (response.ok) {
          // Ensure data is an array; if API returns an object, handle it
          if (Array.isArray(data)) {
            setComments(data);
          } else if (data.comments && Array.isArray(data.comments)) {
            setComments(data.comments);
          } else {
            setComments([]);
            setErrorComments('No comments available.');
          }
        } else {
          setErrorComments('Failed to load comments.');
        }
      } catch (error) {
        setErrorComments('An error occurred while fetching comments.');
      } finally {
        setLoadingComments(false);
      }
    };

    if (blog?.id) {
      fetchComments();
    }
  }, [blog?.id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (newComment.trim() && blog?.id) {
      const comment = { text: newComment, date: new Date().toISOString().split('T')[0] };
      try {
        const response = await fetch('/api/post', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ blogId: blog.id, comment }),
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
          alert('Failed to post comment. Please try again.');
        }
      } catch (error) {
        console.error('Error saving comment:', error);
        alert('An error occurred while posting the comment.');
      }
    }
  };

  const sharePost = () => {
    if (!blog) return;
    const shareText = `${blog.title}\n${blog.content}\nCheck out this post on Knowtivus!`;
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

  return (
    <div className="max-w-3xl mx-auto p-4">
      <Head>
        <title>{blog ? `${blog.title} | Knowtivus` : 'Blog Not Found | Knowtivus'}</title>
        <meta name="description" content={blog ? blog.content.slice(0, 150) : 'Blog not found on Knowtivus.'} />
        <meta name="keywords" content={blog && blog.tags ? blog.tags.join(', ') : 'blog, knowtivus'} />
        <meta name="robots" content="index, follow" />
      </Head>

      {blog ? (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-purple-400 mb-2">
            {blog.title || 'Untitled Post'}
          </h1>
          <p className="text-xs text-gray-400 mb-3">
            {blog.date} {blog.time ? `at ${blog.time}` : ''}
          </p>
          <div className="leading-relaxed text-justify">
            {blog.content && blog.content.split('\n').map((line, index) => {
              if (line.startsWith('Question:')) {
                return (
                  <p key={index} className="text-base font-semibold text-pink-400">
                    {line.replace('Question:', '').trim()}
                  </p>
                );
              } else if (line.startsWith('Answer')) {
                return (
                  <p key={index} className="text-gray-300 mt-2">
                    {line.replace(/Answer \d+:/, '').trim()}
                  </p>
                );
              }
              return null;
            })}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {blog.tags && blog.tags.length > 0 ? (
              blog.tags.map((tag, index) => (
                <span
                  key={index}
                  className="text-xs bg-blue-900 text-blue-300 px-2 py-1 rounded"
                >
                  {tag}
                </span>
              ))
            ) : (
              <span className="text-xs text-gray-400">No tags</span>
            )}
          </div>
          <button
            onClick={sharePost}
            className="mt-3 text-green-400 hover:underline text-sm"
          >
            Share
          </button>
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-white">Comments</h3>
            {loadingComments ? (
              <p className="text-gray-400 mt-2">Loading comments...</p>
            ) : errorComments ? (
              <p className="text-red-400 mt-2">{errorComments}</p>
            ) : comments.length > 0 ? (
              comments.map((comment, index) => (
                <div key={index} className="mt-3 p-3 bg-gray-700 rounded-lg">
                  <p className="text-gray-300">{comment.text}</p>
                  <p className="text-xs text-gray-400">{comment.date}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-400 mt-2">No comments yet. Be the first to comment!</p>
            )}
            <form onSubmit={handleCommentSubmit} className="mt-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full p-3 border rounded-lg bg-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Add a comment..."
                rows="3"
              />
              <button
                type="submit"
                className="mt-2 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-500 text-sm"
              >
                Post Comment
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-gray-400">Blog not found!</p>
          <button
            onClick={() => router.push('/')}
            className="mt-4 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-500 text-sm"
          >
            Back to Home
          </button>
        </div>
      )}
    </div>
  );
}

// Main App Component
export default function App({ initialBlogs, slug, initialTotalBlogs, blogsPerPage }) {
  const router = useRouter();
  const [blogs, setBlogs] = useState(initialBlogs || []);
  const [totalBlogs, setTotalBlogs] = useState(initialTotalBlogs || 0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showScrollButton, setShowScrollButton] = useState(true);
  const [scrollDirection, setScrollDirection] = useState('down');

  // Get the current page from query parameters
  useEffect(() => {
    const pageFromQuery = parseInt(router.query.page, 10) || 1;
    setCurrentPage(pageFromQuery);
  }, [router.query.page]);

  const fetchBlogs = async (page = 1) => {
    setLoading(true);
    setError(null);
    const limit = blogsPerPage;
    const offset = (page - 1) * limit;
    try {
      const response = await fetch(`/api/post?limit=${limit}&offset=${offset}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (response.ok && Array.isArray(data)) {
        setBlogs(data);
      } else {
        setError('Failed to load blogs. Please try again.');
      }

      // Fetch total count if not already set
      if (totalBlogs === 0) {
        const countResponse = await fetch('/api/post?count=true', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const countData = await countResponse.json();
        if (countResponse.ok) {
          setTotalBlogs(countData.count || 0);
        }
      }
    } catch (error) {
      setError('An error occurred while fetching blogs.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch blogs when the page changes
  useEffect(() => {
    if (currentPage !== 1 || !initialBlogs || initialBlogs.length === 0) {
      fetchBlogs(currentPage);
    }
  }, [currentPage]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      if (documentHeight > windowHeight) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }

      if (scrollPosition + windowHeight >= documentHeight - 50) {
        setScrollDirection('up');
      } else if (scrollPosition <= 50) {
        setScrollDirection('down');
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollClick = () => {
    if (scrollDirection === 'down') {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth',
      });
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  // Determine which component to render based on route
  let content;
  const currentPath = router.pathname;

  if (currentPath === '/about') {
    content = (
      <>
        <Head>
          <title>About Us | Knowtivus</title>
          <meta name="description" content="Learn more about Knowtivus and its mission to share knowledge freely." />
          <meta name="keywords" content="about us, knowtivus, knowledge sharing" />
          <meta name="robots" content="index, follow" />
        </Head>
        <AboutUs />
      </>
    );
  } else if (currentPath === '/privacy') {
    content = (
      <>
        <Head>
          <title>Privacy Policy | Knowtivus</title>
          <meta name="description" content="Read the privacy policy of Knowtivus. Your privacy is our priority." />
          <meta name="keywords" content="privacy policy, knowtivus, data privacy" />
          <meta name="robots" content="index, follow" />
        </Head>
        <PrivacyPolicy />
      </>
    );
  } else if (currentPath === '/disclaimer') {
    content = (
      <>
        <Head>
          <title>Disclaimer | Knowtivus</title>
          <meta name="description" content="Read the disclaimer for the content provided on Knowtivus." />
          <meta name="keywords" content="disclaimer, knowtivus, educational content" />
          <meta name="robots" content="index, follow" />
        </Head>
        <Disclaimer />
      </>
    );
  } else if (currentPath === '/contact') {
    content = (
      <>
        <Head>
          <title>Contact Us | Knowtivus</title>
          <meta name="description" content="Get in touch with Knowtivus for feedback and suggestions." />
          <meta name="keywords" content="contact us, knowtivus, feedback" />
          <meta name="robots" content="index, follow" />
        </Head>
        <ContactUs />
      </>
    );
  } else if (currentPath.startsWith('/blog/') && slug) {
    content = <Blog blogs={blogs} slug={slug} />;
  } else {
    content = (
      <Home
        blogs={blogs}
        setBlogs={setBlogs}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        currentPage={currentPage}
        totalBlogs={totalBlogs}
        blogsPerPage={blogsPerPage}
        fetchBlogs={fetchBlogs}
        loading={loading}
        error={error}
      />
    );
  }

  return (
    <div>
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="sticky top-0 z-10 bg-gray-800 shadow-lg p-4">
          <div className="max-w-3xl mx-auto flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <Link href="/">
                <a>
                  <img src="/logo.png" alt="Knowtivus Logo" className="h-12 w-auto" />
                </a>
              </Link>
              <div className="flex items-center space-x-4">
                <Link href="/">
                  <a className="text-sm hover:text-blue-400">Home</a>
                </Link>
              </div>
            </div>
            <div className="mt-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search blogs..."
                className="w-full p-2 border rounded-lg text-gray-900 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-bold text-white">Latest Blogs</h1>
              <button
                onClick={() => fetchBlogs(currentPage)}
                className="px-2 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-500 text-xs"
              >
                Refresh Blogs
              </button>
            </div>
          </div>
        </div>

        {content}

        <footer className="bg-gray-800 text-gray-300 p-4 mt-8">
          <div className="max-w-3xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm">© 2025 Knowtivus. All rights reserved.</p>
            <div className="flex flex-wrap gap-4">
              <Link href="/about">
                <a className="text-sm hover:text-blue-400">About Us</a>
              </Link>
              <Link href="/privacy">
                <a className="text-sm hover:text-blue-400">Privacy Policy</a>
              </Link>
              <Link href="/disclaimer">
                <a className="text-sm hover:text-blue-400">Disclaimer</a>
              </Link>
              <Link href="/contact">
                <a className="text-sm hover:text-blue-400">Contact Us</a>
              </Link>
            </div>
          </div>
        </footer>

        {showScrollButton && (
          <button
            onClick={handleScrollClick}
            className="fixed bottom-4 right-4 p-3 rounded-full bg-gray-800 hover:bg-gray-700 text-white shadow-lg transition-all"
            title={scrollDirection === 'down' ? 'Scroll to Bottom' : 'Scroll to Top'}
          >
            {scrollDirection === 'down' ? '⇓' : '⇑'}
          </button>
        )}
      </div>
    </div>
  );
    }
