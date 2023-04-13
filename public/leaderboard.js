const usersTableBody = document.querySelector("#users-table tbody");

async function getUsersWithExpenses() {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get("/api/expense/leader", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    response?.data?.forEach((user) => {
      const row = document.createElement("tr");
      const emailCell = document.createElement("td");
      const nameCell = document.createElement("td");
      const totalExpenseCell = document.createElement("td");

      emailCell.textContent = user.email;
      nameCell.textContent = user.name;
      totalExpenseCell.textContent = user.totalExpense;

      row.appendChild(emailCell);
      row.appendChild(nameCell);
      row.appendChild(totalExpenseCell);

      usersTableBody.appendChild(row);
    });
  } catch (error) {
    alert("You are not a premium member");
    window.location.href = "/";
  }
}
window.addEventListener("load", getUsersWithExpenses);
