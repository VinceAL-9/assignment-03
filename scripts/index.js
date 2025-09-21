const $ = (id) => document.getElementById(id);

const signupBtn = $("signupBtn");
const signupModal = new bootstrap.Modal($("signupModal"));

const emailInput = $("email");
const passwordInput = $("password");

const loginForm = $("loginForm");
const loginSubmitBtn = $("loginSubmitBtn");


// Disable enter event on input
emailInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
    }
});
passwordInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
    }
})

signupBtn.onclick = () => {
    signupModal.show();
}

// Fix for login button - prevent form submission and handle redirection
loginSubmitBtn.onclick = (e) => {
    e.preventDefault(); // Prevent the default form submission
    window.location.href = `../public/home.html`;
}


