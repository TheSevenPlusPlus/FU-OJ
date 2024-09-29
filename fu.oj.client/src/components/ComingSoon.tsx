import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface CountdownProps {
    targetDate: Date;
}

const Countdown: React.FC<CountdownProps> = ({ targetDate }) => {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    function calculateTimeLeft() {
        const difference = targetDate.getTime() - new Date().getTime();

        if (difference > 0) {
            return {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        } else {
            return null;
        }
    }

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    if (!timeLeft) {
        return <span>Time's up!</span>;
    }

    const timerComponents = Object.keys(timeLeft).map((interval) => {
        if (!timeLeft[interval as keyof typeof timeLeft]) {
            return null;
        }

        return (
            <div key={interval} className="flex flex-col items-center mx-4">
                <span className="text-4xl font-bold">
                    {timeLeft[interval as keyof typeof timeLeft]}
                </span>
                <span className="text-sm uppercase">{interval}</span>
            </div>
        );
    });

    return (
        <div className="flex justify-center space-x-4">
            {timerComponents.length ? timerComponents : <span>Time's up!</span>}
        </div>
    );
};

interface ComingSoonProps {
    targetDate: Date;
}

export default function ComingSoon({ targetDate }: ComingSoonProps) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-white">
            <div className="text-center p-8 max-w-2xl">
                <Clock className="w-16 h-16 mx-auto mb-8 text-black" />
                <h1 className="text-5xl font-bold mb-4 text-black">
                    Coming Soon
                </h1>
                <p className="text-xl mb-12 text-gray-600">
                    We're working hard to bring you something amazing. Stay
                    tuned!
                </p>
                <div className="mb-12">
                    <Countdown targetDate={targetDate} />
                </div>
                <div className="flex justify-center">
                    <input
                        type="email"
                        placeholder="Enter your email for updates"
                        className="px-4 py-2 w-64 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200"
                    />
                    <button className="bg-black text-white px-6 py-2 hover:bg-gray-800 transition duration-300">
                        Notify Me
                    </button>
                </div>
            </div>
        </div>
    );
}
