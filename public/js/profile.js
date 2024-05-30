document.addEventListener("DOMContentLoaded", () => {
    const userData = JSON.parse(sessionStorage.getItem("userData"));
    if (userData) {
        document.getElementById("profile-username").textContent = userData.username;
        document.getElementById("profile-avatar").src = userData.avatar;
        // Populate other user information dynamically here
    } else {
        alert("No user data found. Redirecting to registration.");
        window.location.href = "/register";
    }
});