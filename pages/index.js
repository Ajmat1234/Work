import App from '../src/App';

export async function getStaticProps({ params }) {
  const page = params?.page ? parseInt(params.page, 10) : 1;
  const limit = 100;
  const offset = (page - 1) * limit;

  try {
    // Fetch blogs for the current page
    const response = await fetch(`https://work-lyart-rho.vercel.app/api/post?limit=${limit}&offset=${offset}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const blogs = await response.json();

    // Fetch total count of blogs
    const countResponse = await fetch('https://work-lyart-rho.vercel.app/api/post?count=true', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const { count } = await countResponse.json();

    return {
      props: {
        initialBlogs: blogs || [],
        currentPage: page,
        totalBlogs: count || 0,
        blogsPerPage: limit,
      },
      revalidate: 60, // Revalidate every 60 seconds (ISR)
    };
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return {
      props: {
        initialBlogs: [],
        currentPage: page,
        totalBlogs: 0,
        blogsPerPage: limit,
      },
      revalidate: 60,
    };
  }
}

// For dynamic routes with query parameters
export async function getStaticPaths() {
  // We can pre-render the first few pages, e.g., page 1
  return {
    paths: [{ params: { page: '1' } }],
    fallback: 'blocking', // Other pages will be generated on-demand
  };
}

export default function HomePage({ initialBlogs, currentPage, totalBlogs, blogsPerPage }) {
  return (
    <App
      initialBlogs={initialBlogs}
      currentPage={currentPage}
      totalBlogs={totalBlogs}
      blogsPerPage={blogsPerPage}
    />
  );
}
