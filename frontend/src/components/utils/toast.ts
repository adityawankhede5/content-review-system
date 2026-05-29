export function showToast(message: string) {
    const toast = document.createElement("div");

    toast.className = `
        fixed top-6 left-1/2 -translate-x-1/2 z-50
        rounded-lg border border-green-500 border-l-4
        bg-white px-5 py-3
        text-sm font-medium text-gray-800
        shadow-lg
        opacity-0 -translate-y-3
        transition-all duration-300 ease-out
        min-w-[320px]
    `;

    toast.textContent = message;

    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.remove("opacity-0", "-translate-y-3");
        toast.classList.add("opacity-100", "translate-y-0");
    });

    setTimeout(() => {
        toast.classList.remove("opacity-100", "translate-y-0");
        toast.classList.add("opacity-0", "-translate-y-3");

        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}