// api/post.js
import { createClient } from 'redis';

const REDIS_HOST = "redis-11005.c8.us-east-1-2.ec2.redns.redis-cloud.com";
const REDIS_PORT = 11005;
const REDIS_USERNAME = "default";
const REDIS_PASSWORD = "MgE5WDoPo33u4beo955KGV4pYlUkWvrn";
const REDIS_DB = 0;

// Redis क्लाइंट सेटअप
const redisClient = createClient({
  url: `redis://${REDIS_USERNAME}:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}/${REDIS_DB}`,
  disableOfflineQueue: true,
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

// Redis से कनेक्ट करें
await redisClient.connect();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const newBlog = req.body;

      // Redis में blogs की लिस्ट रिट्रीव करें
      let blogs = await redisClient.get('blogs');
      blogs = blogs ? JSON.parse(blogs) : [];

      // नई पोस्ट को लिस्ट में जोड़ें
      blogs.push(newBlog);

      // अपडेटेड लिस्ट को Redis में सेव करें
      await redisClient.set('blogs', JSON.stringify(blogs));

      res.status(200).json({ message: 'Blog added successfully!', blog: newBlog });
    } catch (error) {
      console.error('Error adding blog:', error);
      res.status(500).json({ message: 'Error adding blog', error: error.message });
    }
  } else if (req.method === 'GET') {
    try {
      // Redis से blogs रिट्रीव करें
      let blogs = await redisClient.get('blogs');
      blogs = blogs ? JSON.parse(blogs) : [];
      res.status(200).json(blogs);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      res.status(500).json({ message: 'Error fetching blogs', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
