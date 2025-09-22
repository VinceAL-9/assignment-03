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
const modalMessageContainer = $("modalMessageContainer");


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

// Show modal message function
function showModalMessage(message) {
  modalMessageContainer.textContent = message;
  modalMessageContainer.classList.remove("d-none");
  
  // Auto-hide after 3 seconds
  setTimeout(() => {
    modalMessageContainer.classList.add("d-none");
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
  
  // Validate form fields (not empty)
  if (!firstname || !lastname || !email || !birthdate || !password) {
    showModalMessage("Please fill in all required fields");
    return;
  }
  
  // Validate email format using regex
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  if (!emailRegex.test(email)) {
    showModalMessage("Please enter a valid email address");
    return;
  }

  // Validate birthdate format using Date object
  const birthDateObj = new Date(birthdate);
  if (isNaN(birthDateObj.getTime())) {
    // If birthdate is not a valid date, show error message
    showModalMessage("Please enter a valid birthdate");
    return;
  }

  // Calculate age
  const today = new Date();
  let age = today.getFullYear() - birthDateObj.getFullYear();
  const monthDiff = today.getMonth() - birthDateObj.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
    age--;
  }

  // Check if user is at least 12 years old
  if (age < 12) {
    // If user is not at least 12 years old, show error message
    showModalMessage("You must be at least 12 years old to sign up");
    return;
  }

  // Validate password complexity: at least 8 chars, includes a letter, a number, and a symbol
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  if (!passwordRegex.test(password)) {
    showModalMessage("Password must be at least 8 characters and include a letter, a number, and a symbol");
    return;
  }

  if (password !== repassword) {
    showModalMessage("Passwords do not match");
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
      showModalMessage(data.message);
    }
  } catch (error) {
    showModalMessage(`An error occurred: ${error.message}`);
  }
};



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
      // Store user info in browser storage
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
