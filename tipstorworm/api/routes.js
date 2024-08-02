// pages/api/form.js
export default function handler(req, res) {
    if (req.method === 'POST') {
      const data = req.body;
      // Handle form data, e.g., save it to the database
      res.status(200).json(data); // Send back the submitted data

      // mongoDB connect
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  }
  