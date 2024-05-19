// public/js/registration.js

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registrationForm");

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const username = document.getElementById("username").value;
        const avatar = document.getElementById("avatar").files[0];

        const reader = new FileReader();
        reader.onload = function(event) {
            const userData = {
                username: username,
                avatar: event.target.result
            };
            sessionStorage.setItem("userData", JSON.stringify(userData));
            window.location.href = "/profile";
        };

        if (avatar) {
            reader.readAsDataURL(avatar);
        } else {
            const userData = JSON.parse(sessionStorage.getItem("userData"));
            userData.username = username;
            sessionStorage.setItem("userData", JSON.stringify(userData));
            window.location.href = "/profile";
        }
    });

    const userData = JSON.parse(sessionStorage.getItem("userData"));
    if (userData) {
        document.getElementById("username").value = userData.username;
    }
});
