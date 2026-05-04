document.getElementById("signupForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  // validation
  if (name === "" || email === "" || password === "") {
    showToast("Please fill all fields", "warning");
    return;
  }

  // get existing users
  let users = JSON.parse(localStorage.getItem("users")) || [];

  // check if email already exists
  const exists = users.some(user => user.email === email);

  if (exists) {
    showToast("Email already registered!", "wishlist");
    return;
  }

  // create new user
  const newUser = { name, email, password };

  users.push(newUser);

  // save to localStorage
  localStorage.setItem("users", JSON.stringify(users));

  showToast("Account created successfully!", "cart");

  // reset form
  this.reset();

  // redirect (optional)
  setTimeout(() => {
    window.location.href = "index.html";
  }, 2000);
});



function showToast(message, type) {
  const box = document.getElementById("toastBox");

  const toast = document.createElement("div");
  toast.innerText = message;

  toast.className = `toast show ${type}`;

  box.appendChild(toast);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}