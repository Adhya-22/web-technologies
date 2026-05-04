function showToast(message, type) {
  const box = document.getElementById("toastBox");

  const toast = document.createElement("div");
  toast.innerText = message;

  toast.className = `toast show ${type}`;

  box.appendChild(toast);

  setTimeout(() => {
    toast.classList.remove("show");

    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}


document.getElementById("contactForm").addEventListener("submit", function (e) {
  e.preventDefault();

  showToast("Thank you for contacting us!", "cart"); // you can change style

  this.reset();
});