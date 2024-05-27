// public/js/profile.js

document.addEventListener("DOMContentLoaded", () => {
    const userData = JSON.parse(sessionStorage.getItem("userData"));
    if (userData) {
        document.getElementById("profile-username").textContent = userData.username;
        document.getElementById("profile-bio").textContent = userData.bio;
        document.getElementById("profile-avatar").src = userData.avatar;
    } else {
        alert("No user data found. Redirecting to registration.");
        window.location.href = "/register";
    }
});
