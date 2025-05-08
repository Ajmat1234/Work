export default async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      const newBlog = req.body;
      const checkResponse = await fetch('https://auto-generated.onrender.com/api/post', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const existingBlogs = await checkResponse.json();
      if (existingBlogs.some(blog => blog.title === newBlog.title)) {
        return res.status(200).json({ message: "Blog already exists", blog: newBlog });
      }

      const response = await fetch('https://auto-generated.onrender.com/api/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBlog),
      });
      const data = await response.json();

      if (response.ok) {
        res.status(200).json(data);
      } else {
        res.status(response.status).json(data);
      }
    } else if (req.method === 'GET') {
      const { blogId, slug } = req.query;
      let url;
      if (slug) {
        url = 'https://auto-generated.onrender.com/api/post';
      } else if (blogId) {
        url = `https://auto-generated.onrender.com/api/post?blogId=${blogId}`;
      } else {
        url = 'https://auto-generated.onrender.com/api/post';
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      let data = await response.json();

      if (response.ok && slug) {
        // Filter by slug if provided
        data = Array.isArray(data) ? data.find(blog => blog.slug === slug) || [] : [];
      }

      if (response.ok) {
        res.status(200).json(data);
      } else {
        res.status(response.status).json(data);
      }
    } else if (req.method === 'PUT') {
      const { blogId, comment } = req.body;

      const response = await fetch('https://auto-generated.onrender.com/api/post', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blogId, comment }),
      });
      const data = await response.json();

      if (response.ok) {
        res.status(200).json(data);
      } else {
        res.status(response.status).json(data);
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}
