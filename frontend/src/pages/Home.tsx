import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../api/auth.api";
import AvailableTickets from "../components/AvailableTickets";
import ReservedTickets from "../components/ReservedTickets";
import ConfirmedTickets from "../components/ConfirmedTickets";
import TicketDashboard from "../components/TicketDashboard";
export default function Home() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            setIsAuthenticated(false);
            navigate("/login");
            return;
        }
        setIsAuthenticated(true);
    }, []);
    return (
        <div>
            <header
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "1rem",
                }}
            >
                <h2>{localStorage.getItem("reviewerName")} ({localStorage.getItem("reviewerLocale")})</h2>
                <button onClick={logout}>Logout</button>
            </header>
            <main style={{ padding: "1rem" }}>
                <TicketDashboard />
            </main>

        </div>
    )
}