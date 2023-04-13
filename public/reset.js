function resetPassword() {
  const token = document.getElementById("token").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;

  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  axios
    .post("/api/auth/reset", { token, password })
    .then(function (response) {
      if (response.status === 200) {
        alert("Your password has been updated.");
        window.location.href = "/signin";
      } else {
        alert("Error: " + response.data.message);
      }
    })
    .catch(function (error) {
      alert("Error: " + error.message);
    });
}
