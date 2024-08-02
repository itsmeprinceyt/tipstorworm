// pages/success.js
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Success() {
  const router = useRouter();
  const { query } = router;

  useEffect(() => {
    if (query) {
      console.log('Submitted data:', query);
    }
  }, [query]);

  return (
    <div className="bg-green-400 p-4">
      <h1 className="text-white">Form submitted successfully!</h1>
      <pre className="text-white">{JSON.stringify(query, null, 2)}</pre>
    </div>
  );
}
