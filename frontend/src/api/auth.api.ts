export const login = async (email: string) => {
    if (!email) return;
    try {
        const response = await fetch("http://localhost:8080/api/v1/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Login failed");
        }
        const data = await response.json();
        return data.accessToken;
    } catch (error) {
        console.error("Login error:", error);
        return null;
    }
}

export const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("reviewerName");
    localStorage.removeItem("reviewerLocale");
    localStorage.removeItem("reviewerEmail");
    window.location.href = "/login";
}