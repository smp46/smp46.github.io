import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Feed() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/feeds/feed.xml');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Redirecting to RSS feed...</p>
    </div>
  );
}

