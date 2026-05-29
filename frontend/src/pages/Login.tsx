import { useNavigate } from "react-router-dom";
import { REVIEWERS } from "../CONSTANTS";
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
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h1 className="text-2xl font-semibold text-gray-900 mb-6">
                    Login
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="reviewer"
                            className="text-sm font-medium text-gray-700"
                        >
                            Select Reviewer
                        </label>

                        <select
                            name="reviewer"
                            id="reviewer"
                            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-gray-500"
                        >
                            {REVIEWERS.map((reviewer) => (
                                <option
                                    key={reviewer.email}
                                    value={reviewer.email}
                                >
                                    {reviewer.name} - {reviewer.locale}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}