import { useNavigate } from "react-router-dom";
import {REVIEWERS} from "../CONSTANTS";
import { login } from "../api/auth.api";
export default function Login() {
    const navigate = useNavigate();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const reviewerEmail = formData.get("reviewer") as string;
        console.log("Selected reviewer email:", reviewerEmail);
        const accessToken = await login(reviewerEmail);
        if (!accessToken) return alert("Login failed. Please try again.");
        localStorage.setItem("accessToken", accessToken);
        const reviewer = REVIEWERS.find((r) => r.email === reviewerEmail);
        if (reviewer) {
            localStorage.setItem("reviewerName", reviewer.name);
            localStorage.setItem("reviewerLocale", reviewer.locale);
            localStorage.setItem("reviewerEmail", reviewer.email);
        }
        navigate("/");
    };
    return (
        <div>
            <h1>Login Page</h1>
            <p>This is a placeholder for the login page. Implement authentication here.</p>

            <form onSubmit={handleSubmit} style={{ display: "flex", gap: "1rem", width: "400px" }}>
                <label htmlFor="reviewer">Select Reviewer:</label>
                <select name="reviewer" id="reviewer">
                    {REVIEWERS.map((reviewer) => (
                        <option key={reviewer.email} value={reviewer.email}>
                            {reviewer.name} - {reviewer.locale}
                        </option>
                    ))}
                </select>
                <button type="submit">Login</button>
            </form>
        </div>
    )
}