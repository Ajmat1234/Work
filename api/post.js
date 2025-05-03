// api/post.js
export default function handler(req, res) {
  if (req.method === 'POST') {
    const newBlog = req.body;
    // अभी के लिए हम सिर्फ रिक्वेस्ट बॉडी को रिटर्न कर रहे हैं
    // प्रोडक्शन में यहाँ डेटाबेस में डेटा सेव करना चाहिए (जैसे MongoDB)
    res.status(200).json({ message: 'Blog added successfully!', blog: newBlog });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
