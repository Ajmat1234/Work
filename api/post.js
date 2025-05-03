import { createClient } from 'redis';

const REDIS_HOST = "redis-11005.c8.us-east-1-2.ec2.redns.redis-cloud.com";
const REDIS_PORT = 11005;
const REDIS_USERNAME = "default";
const REDIS_PASSWORD = "MgE5WoDPo33u4beo955kGV4pYlUkWvmg";
const REDIS_DB = 0;

// Redis क्लाइंट सेटअप
const redisClient = createClient({
  url: `redis://${REDIS_USERNAME}:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}/${REDIS_DB}`,
  disableOfflineQueue: true,
  socket: {
    tls: true,
    rejectUnauthorized: false
  }
});

redisClient.on('error', (err) => console.error('Redis Client Error:', err));

// Redis कनेक्शन को चेक करें और कनेक्ट करें
const ensureRedisConnection = async () => {
  if (!redisClient.isOpen) {
    console.log('Connecting to Redis...');
    await redisClient.connect();
    console.log('Redis connected successfully.');
  }
};

export default async function handler(req, res) {
  try {
    // हर रिक्वेस्ट के लिए Redis कनेक्शन चेक करें
    await ensureRedisConnection();

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
    if (redisClient.isOpen) {
      await redisClient.quit();
      console.log('Redis connection closed.');
    }
  }
}
