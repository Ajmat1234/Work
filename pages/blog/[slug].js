import { useState, useEffect } from 'react';
import App from '../../src/App';
import Head from 'next/head';

export default function BlogPage({ slug }) {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/post?slug=${slug}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        if (response.ok && data) {
          setBlog(data);
        } else {
          setError('Blog not found.');
        }
      } catch (error) {
        setError('An error occurred while fetching the blog.');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-4 text-center text-gray-400">
        Loading blog...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-4 text-center text-red-400">
        {error}
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{blog?.title || 'Blog Post | Knowtivus'}</title>
        <meta name="description" content={blog?.content?.split('\n')[0] || 'Read this insightful blog post on Knowtivus.'} />
        <meta name="keywords" content={blog?.tags?.join(', ') || 'blog, knowledge, education'} />
        <meta name="robots" content="index, follow" />
      </Head>
      <App blogs={blog ? [blog] : []} slug={slug} />
    </>
  );
}

export async function getServerSideProps({ params }) {
  return {
    props: {
      slug: params.slug,
    },
  };
}
