import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL, // Vercel का नया Redis URL
  socket: {
    tls: true,
    rejectUnauthorized: false,
    connectTimeout: 5000, // 5 सेकंड का टाइमआउट
    reconnectStrategy: (retries) => Math.min(retries * 500, 3000) // री-कनेक्ट स्ट्रैटेजी
  }
});

redisClient.on('error', (err) => console.error('Redis Client Error:', err));
redisClient.on('connect', () => console.log('Redis Client Connected'));
redisClient.on('ready', () => console.log('Redis Client Ready'));
redisClient.on('end', () => console.log('Redis Client Disconnected'));

// Redis कनेक्शन को चेक करें और कनेक्ट करें
const ensureRedisConnection = async () => {
  try {
    if (!redisClient.isOpen) {
      console.log('Connecting to Redis...');
      await redisClient.connect();
      console.log('Redis connected successfully.');
      return true;
    } else {
      console.log('Redis already connected.');
      return true;
    }
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
    return false; // कनेक्शन फेल होने पर false रिटर्न करें
  }
};

export default async function handler(req, res) {
  let redisConnected = false;

  try {
    // Redis कनेक्शन चेक करें
    redisConnected = await ensureRedisConnection();

    if (!redisConnected) {
      console.error('Redis connection failed. Returning default response.');
      if (req.method === 'GET') {
        return res.status(200).json([]); // खाली लिस्ट रिटर्न करें
      } else {
        return res.status(503).json({ message: 'Service unavailable: Unable to connect to Redis' });
      }
    }

    if (req.method === 'POST') {
      const newBlog = req.body;

      // Redis में blogs की लिस्ट रिट्रीव करें
      let blogs = await redisClient.get('blogs');
      blogs = blogs ? JSON.parse(blogs) : [];

      // नई पोस्ट को लिस्ट में जोड़ें
      blogs.push(newBlog);

      // अपडेटेड लिस्ट को Redis में सेव करें
      await redisClient.set('blogs', JSON.stringify(blogs));

      res.status(200).json({ message: 'Blog added successfully!', blog: newBlog });
    } else if (req.method === 'GET') {
      // Redis से blogs रिट्रीव करें
      let blogs = await redisClient.get('blogs');
      blogs = blogs ? JSON.parse(blogs) : [];
      res.status(200).json(blogs);
    } else if (req.method === 'PUT') {
      const { blogId, comment } = req.body;

      // ब्लॉग पोस्ट के लिए कमेंट्स की लिस्ट रिट्रीव करें
      let comments = await redisClient.get(`blog:${blogId}:comments`);
      comments = comments ? JSON.parse(comments) : [];

      // नया कमेंट जोड़ें
      comments.push(comment);

      // अपडेटेड कमेंट्स लिस्ट को Redis में सेव करें
      await redisClient.set(`blog:${blogId}:comments`, JSON.stringify(comments));

      res.status(200).json({ message: 'Comment added successfully!', comment });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  } finally {
    // कनेक्शन बंद करें (Vercel सर्वरलेस के लिए)
    try {
      if (redisClient.isOpen) {
        await redisClient.quit();
        console.log('Redis connection closed.');
      }
    } catch (error) {
      console.error('Error closing Redis connection:', error);
    }
  }
                          }
