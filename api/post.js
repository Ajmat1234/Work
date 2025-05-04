export default async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      const newBlog = req.body;

      // बैकएंड API को कॉल करें
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
      // बैकएंड API से ब्लॉग्स लें
      const blogId = req.query.blogId;
      const url = blogId 
        ? `https://auto-generated.onrender.com/api/post?blogId=${blogId}` 
        : 'https://auto-generated.onrender.com/api/post';

      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();

      if (response.ok) {
        res.status(200).json(data);
      } else {
        res.status(response.status).json(data);
      }
    } else if (req.method === 'PUT') {
      const { blogId, comment } = req.body;

      // बैकएंड API को कमेंट भेजें
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
