"use client";
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';

const HeartbeatContent = () => {
    const pathname = usePathname();

    useEffect(() => {
        if (pathname === '/') {
            setTimeout(() => {
                triggerHeartbeat();
            }, 500);
        }
    }, [pathname]);

    const triggerHeartbeat = async () => {
        await fetch('/api/public/heartbeat');
    };

    return null;
};

const HomePageHeartbeat = dynamic(() => Promise.resolve(HeartbeatContent), {
    ssr: false,
    loading: () => null
});

export default HomePageHeartbeat;