import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../api/auth.api";
import TicketDashboard from "../components/TicketDashboard";
import MetricsDashboard from "../components/MetricsDashboard/MetricsDashboard";
export default function Home() {
    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            navigate("/login");
            return;
        }
    }, []);
    return (
        <div className="min-h-screen bg-gray-50">
            <header className="border-b border-gray-200 bg-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            {localStorage.getItem("reviewerName")}
                        </h2>
                        <p className="text-sm text-gray-500">
                            {localStorage.getItem("reviewerLocale")}
                        </p>
                    </div>

                    <button
                        onClick={logout}
                        className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                    >
                        Logout
                    </button>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-6 py-6">
                <TicketDashboard />
                <MetricsDashboard />
            </main>
        </div>
    );
}