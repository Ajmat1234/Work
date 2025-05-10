import App from '../src/App';

// Utility function to fetch with retries
const fetchWithRetry = async (url, options, retries = 3, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      if (i === retries - 1) throw error; // Last retry
      console.warn(`Fetch failed for ${url}, retrying (${i + 1}/${retries})...`, error.message);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

export async function getStaticProps({ params }) {
  const page = params?.page ? parseInt(params.page, 10) : 1; // Default to page 1 for root route
  const limit = 100;
  const offset = (page - 1) * limit;

  try {
    // Directly fetch from Render.com backend to avoid circular dependency
    const blogsUrl = `https://auto-generated.onrender.com/api/post?limit=${limit}&offset=${offset}`;
    const countUrl = 'https://auto-generated.onrender.com/api/post?count=true';

    console.log(`Fetching blogs for page ${page}...`);
    const blogs = await fetchWithRetry(blogsUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    console.log(`Fetching total blogs count...`);
    const countData = await fetchWithRetry(countUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    const count = countData?.count || 0;

    return {
      props: {
        initialBlogs: blogs || [],
        currentPage: page,
        totalBlogs: count,
        blogsPerPage: limit,
      },
      revalidate: 60, // Revalidate every 60 seconds (ISR)
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error.message);
    // Fallback to empty data to ensure build doesn't fail
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

export async function getStaticPaths() {
  // Pre-render only the first page (/)
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
