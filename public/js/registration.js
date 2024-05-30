// public/js/registration.js

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registrationForm");

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const username = document.getElementById("username").value;
        const bio = document.getElementById("bio").value;
        const avatar = document.getElementById("avatar").value;

        const reader = new FileReader();
        reader.onload = function(event) {
            const userData = {
                username: username,
                bio: bio,
                avatar: avatar
            };
            sessionStorage.setItem("userData", JSON.stringify(userData));

            // TODO: save to database
            window.location.href = "/profile";
        };

        const userData = JSON.parse(sessionStorage.getItem("userData"));
        userData.username = username;
        userData.bio = bio;
        userData.avatar = avatar;
        sessionStorage.setItem("userData", JSON.stringify(userData));
        window.location.href = "/profile";
    });

    const userData = JSON.parse(sessionStorage.getItem("userData"));
    if (userData) {
        document.getElementById("username").value = userData.username;
        document.getElementById("bio").value = userData.bio;
        document.getElementById("avatar").value = userData.avatar;
    }
});
