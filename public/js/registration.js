// public/js/registration.js

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registrationForm");

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const username = document.getElementById("username").value;
        const bio = document.getElementById("bio").value;
        const avatar = document.getElementById("avatar").value;
        const userData = {
            username: username,
            bio: bio,
            avatar: avatar
        };
        console.log(userData);
        sessionStorage.setItem("userData", JSON.stringify(userData));

        // TODO: save to database
        window.location.href = "/main";

    });

    const userData = JSON.parse(sessionStorage.getItem("userData"));
    if (userData) {
        document.getElementById("username").value = userData.username;
        document.getElementById("bio").value = userData.bio;
        document.getElementById("avatar").value = userData.avatar;
    }
});

// Обработка регистрации пользователя
// router.post("/register", async (req, res) => {
//   const { username, email, photos } = req.body;
//   const walletAddress = req.session.walletAddress;

//   try {
//     if (!walletAddress) {
//       throw new Error("Wallet address is not found in session");
//     }
//     const user = new User({
//       username,
//       email,
//       photos: photos ? [photos] : [],
//       walletAddress,
//     });
//     await user.save();
//     req.session.userId = user._id;
//     res.redirect("/main");
//   } catch (error) {
//     console.error(error);
//     res.redirect("/register");
//   }
// });