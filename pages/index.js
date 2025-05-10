import App from '../src/App';

export async function getStaticProps() {
  try {
    const response = await fetch('https://work-lyart-rho.vercel.app/api/post', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    if (response.ok && Array.isArray(data)) {
      return {
        props: { initialBlogs: data },
        revalidate: 60, // Revalidate every 60 seconds (ISR)
      };
    }
  } catch (error) {
    console.error('Error fetching blogs:', error);
  }
  return {
    props: { initialBlogs: [] },
    revalidate: 60,
  };
}

export default function HomePage(props) {
  return <App initialBlogs={props.initialBlogs} />;
}
