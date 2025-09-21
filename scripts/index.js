const $ = (id) => document.getElementById(id);

const signupBtn = $("signupBtn");
const signupModal = new bootstrap.Modal($("signupModal"));
const signupForm = $("signupForm");
const signupSubmitBtn = $("signupSubmitBtn");

const emailInput = $("email");
const passwordInput = $("password");

const loginForm = $("loginForm");
const loginSubmitBtn = $("loginSubmitBtn");
const messageContainer = $("messageContainer");


// Show message function
function showMessage(type, message) {
  messageContainer.className = `alert alert-${type}`;
  messageContainer.textContent = message;
  messageContainer.classList.remove("d-none");
  
  // Auto-hide after 3 seconds
  setTimeout(() => {
    messageContainer.classList.add("d-none");
  }, 3000);
}

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

signupSubmitBtn.onclick = async () => {
  const firstname = $("signupFirstname").value;
  const lastname = $("signupLastname").value;
  const email = $("signupEmail").value;
  const birthdate = $("signupBirthdate").value;
  const password = $("signupPassword").value;
  const repassword = $("signupRepassword").value;
  
  // Validate form
  if (!firstname || !lastname || !email || !birthdate || !password) {
    alert("Please fill in all required fields");
    return;
  }
  
  if (password !== repassword) {
    showMessage("danger", "Passwords do not match");
    return;
  }
  
  try {
    const response = await fetch("http://localhost:3000/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstname,
        lastname,
        email,
        birthdate,
        password
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Close modal and show success message
      signupModal.hide();
      showMessage("success", "Registration successful! You can now log in.");
      signupForm.reset();
    } else {
      showMessage("danger", data.message);
    }
  } catch (error) {
    showMessage("danger", "An error occurred. Please try again.");
  }
};






// Fix for login button - prevent form submission and handle redirection
// Handle login
loginForm.onsubmit = async (e) => {
  e.preventDefault();
  
  const email = emailInput.value;
  const password = passwordInput.value;
  
  if (!email || !password) {
    showMessage("danger", "Please enter both email and password");
    return;
  }
  
  try {
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();

    if (data.success) {
      // Store user info (optional)
      sessionStorage.setItem("user", JSON.stringify(data.user));
      
      // Redirect to home page
      window.location.href = "../public/home.html";
    } 
    
    else {
      showMessage("danger", data.message);
    }
  } 
  
  catch (error) {
    showMessage("danger", "An error occurred. Please try again.");
  }
};
