import { useState, useEffect } from "react";
export default function ExpiryCountDown({ expiryTime }: { expiryTime: string }) {
    const [timeLeft, setTimeLeft] = useState("");

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const expiry = new Date(expiryTime);
            const diff = expiry.getTime() - now.getTime();

            if (diff <= 0) {
                setTimeLeft("Expired");
                clearInterval(interval);
                return;
            }

            const minutes = Math.floor(diff / 60000);
            const seconds = Math.floor((diff % 60000) / 1000);
            setTimeLeft(`${minutes}m ${seconds}s`);
        }, 1000);

        return () => clearInterval(interval);
    }, [expiryTime]);

    return <span>{timeLeft}</span>;
}