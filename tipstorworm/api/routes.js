import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

// Disable Next.js default body parsing
export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const form = new formidable.IncomingForm();
        
        // Parse the form data
        form.parse(req, (err, fields, files) => {
            if (err) {
                console.error('Form parsing error:', err);
                return res.status(500).json({ message: 'Error parsing form data' });
            }

            // Access fields and files
            console.log('Fields:', fields);
            console.log('Files:', files);

            // Optionally handle file saving
            if (files.Photo && files.Photo[0]) {
                const oldPath = files.Photo[0].filepath;
                const newPath = path.join(process.cwd(), 'public', 'uploads', files.Photo[0].originalFilename);
                
                fs.rename(oldPath, newPath, (err) => {
                    if (err) {
                        console.error('File saving error:', err);
                        return res.status(500).json({ message: 'Error saving file' });
                    }
                });
            }

            // Respond with success
            res.status(200).json({ message: 'Data received successfully', fields, files });
        });
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
