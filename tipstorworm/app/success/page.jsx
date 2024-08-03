"use client"
import { useRouter } from 'next/navigation';

export default function Success() {
  const router = useRouter();
  const handleClick = () => {
    router.replace("/")
  }
  return (
    <div className="bg-green-400 p-4">
      <h1 className="text-white">Form submitted successfully!</h1>
      <button onClick={handleClick}>Go Home</button>
    </div>
  );
}
