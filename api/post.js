// api/post.js (Next.js API Route)
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default async function handler(req, res) {
  console.log(`Accessing /api/post with method: ${req.method}`);

  // Add Cache-Control headers to disable Vercel caching for all responses
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  try {
    if (req.method === 'POST') {
      const newBlog = req.body;

      // Check if the blog already exists
      const { data: existingBlog, error: checkError } = await supabase
        .from('blogs')
        .select('title')
        .eq('title', newBlog.title)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking existing blog:', checkError.message);
        return res.status(500).json({ message: 'Error checking blog existence', error: checkError.message });
      }

      if (existingBlog) {
        console.log(`Blog with title '${newBlog.title}' already exists, skipping insert.`);
        return res.status(200).json({ message: 'Blog already exists', blog: newBlog });
      }

      // Insert the new blog into Supabase
      const postData = {
        title: newBlog.title,
        content: newBlog.content,
        date: newBlog.date,
        tags: newBlog.tags,
        meta_title: newBlog.meta_title,
        meta_description: newBlog.meta_description,
        slug: newBlog.slug,
      };

      const { data, error } = await supabase.from('blogs').insert(postData).select();
      if (error) {
        console.error('Error inserting blog:', error.message);
        return res.status(500).json({ message: 'Error inserting blog', error: error.message });
      }

      console.log(`Blog added successfully: ${postData.title}`);
      return res.status(200).json({ message: 'Blog added successfully', blog: data[0] });
    } else if (req.method === 'GET') {
      const blogId = req.query.blogId;

      if (blogId) {
        // Fetch comments for a specific blog
        const { data, error } = await supabase
          .from('comments')
          .select('*')
          .eq('blog_id', blogId);

        if (error) {
          console.error('Error fetching comments:', error.message);
          return res.status(500).json({ message: 'Error fetching comments', error: error.message });
        }

        console.log(`Fetched comments for blog_id: ${blogId}, count: ${data.length}`);
        return res.status(200).json(data || []);
      } else {
        // Fetch all blogs
        const { data, error } = await supabase.from('blogs').select('*');

        if (error) {
          console.error('Error fetching blogs:', error.message);
          return res.status(500).json({ message: 'Error fetching blogs', error: error.message });
        }

        console.log(`Fetched all blogs: ${data.length} posts found`);
        return res.status(200).json(data || []);
      }
    } else if (req.method === 'PUT') {
      const { blogId, comment } = req.body;

      // Check for duplicate comment
      const { data: existingComment, error: checkError } = await supabase
        .from('comments')
        .select('*')
        .eq('blog_id', blogId)
        .eq('text', comment.text)
        .eq('date', comment.date)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking existing comment:', checkError.message);
        return res.status(500).json({ message: 'Error checking comment existence', error: checkError.message });
      }

      if (existingComment) {
        console.log(`Duplicate comment detected for blog_id ${blogId}: ${comment.text}`);
        return res.status(200).json({ message: 'Comment already exists', comment });
      }

      // Insert the new comment
      const commentData = {
        blog_id: blogId,
        text: comment.text,
        date: comment.date,
      };

      const { data, error } = await supabase.from('comments').insert(commentData).select();
      if (error) {
        console.error('Error inserting comment:', error.message);
        return res.status(500).json({ message: 'Error inserting comment', error: error.message });
      }

      console.log('Comment added successfully');
      return res.status(200).json({ message: 'Comment added', comment: data[0] });
    } else {
      return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error.message);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}
