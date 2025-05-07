export default async function handler(req, res) {
  const response = await fetch('https://auto-generated.onrender.com/sitemap.xml');

  if (!response.ok) {
    res.status(500).send('Failed to fetch sitemap');
    return;
  }

  const xml = await response.text();
  res.setHeader('Content-Type', 'application/xml');
  res.status(200).send(xml);
}
