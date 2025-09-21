import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

const users = [];

app.use(cors()).use(express.json());

// Sign up endpoint
app.post("/signup", (req, res) => {
  const { firstname, lastname, email, birthdate, password } = req.body;
  
  // Check if user already exists
  if (users.find(user => user.email === email)) {
    return res.status(400).json({ success: false, message: "Email already registered" });
  }
  
  // Create new user
  const newUser = {
    firstname,
    lastname,
    email,
    birthdate,
    password 
  };
  
  users.push(newUser);
  console.log("User registered:", newUser);
  
  res.status(201).json({ success: true, message: "Registration successful" });
});

// Login endpoint
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  
  // Find user
  const user = users.find(user => user.email === email);
  
  // Check if user exists and password matches
  if (!user || user.password !== password) {
    return res.status(401).json({ success: false, message: "Invalid email or password" });
  }
  
  // Success - in a real app, you'd create a session or JWT token here
  res.status(200).json({ 
    success: true, 
    message: "Login successful",
    user: {
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email
    }
  });
});


app.listen(3000, () => {
    console.log(`Server is running on http://localhost:${PORT}`);});