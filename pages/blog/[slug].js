import App from '../../src/App';

export async function getStaticPaths() {
  try {
    const response = await fetch('https://work-lyart-rho.vercel.app/api/post', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const blogs = await response.json();
    const paths = blogs.map((blog) => ({
      params: { slug: blog.slug },
    }));
    return {
      paths,
      fallback: 'blocking',
    };
  } catch (error) {
    console.error('Error fetching slugs:', error);
    return { paths: [], fallback: 'blocking' };
  }
}

export async function getStaticProps({ params }) {
  try {
    const response = await fetch('https://work-lyart-rho.vercel.app/api/post', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const blogs = await response.json();
    return {
      props: { initialBlogs: blogs, slug: params.slug },
      revalidate: 60,
    };
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return {
      props: { initialBlogs: [], slug: params.slug },
      revalidate: 60,
    };
  }
}

export default function BlogPage(props) {
  return <App initialBlogs={props.initialBlogs} slug={props.slug} />;
}
