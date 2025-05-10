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

export async function getStaticProps() {
  const limit = 100;
  const offset = 0; // Always fetch the first page for the root route

  try {
    // Directly fetch from Render.com backend
    const blogsUrl = `https://auto-generated.onrender.com/api/post?limit=${limit}&offset=${offset}`;
    const countUrl = 'https://auto-generated.onrender.com/api/post?count=true';

    console.log('Fetching blogs for the first page...');
    const blogs = await fetchWithRetry(blogsUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    console.log('Fetching total blogs count...');
    const countData = await fetchWithRetry(countUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    const count = countData?.count || 0;

    return {
      props: {
        initialBlogs: blogs || [],
        initialTotalBlogs: count || 0,
        blogsPerPage: limit,
      },
      revalidate: 60, // Revalidate every 60 seconds (ISR)
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error.message);
    return {
      props: {
        initialBlogs: [],
        initialTotalBlogs: 0,
        blogsPerPage: limit,
      },
      revalidate: 60,
    };
  }
}

export default function HomePage({ initialBlogs, initialTotalBlogs, blogsPerPage }) {
  return (
    <App
      initialBlogs={initialBlogs}
      initialTotalBlogs={initialTotalBlogs}
      blogsPerPage={blogsPerPage}
    />
  );
}
