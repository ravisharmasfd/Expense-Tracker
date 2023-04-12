const Table = document.querySelector("#expense-list");
const Total = document.querySelector("#total");

async function fetchExpenseReport(timeframe) {
  try {
    const token = localStorage.getItem("token");
    console.log(token)
    const response = await axios.post(
      "/api/expense/report",
      { timeframe },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response)
    const expenses = response.data.expenses;
    let total = 0;
    const table = Table;
    table.innerHTML = "";

    expenses.forEach((expense) => {
      const row = document.createElement("tr");
      const descriptionCell = document.createElement("td");
      const categoryCell = document.createElement("td");
      const amountCell = document.createElement("td");

      descriptionCell.textContent = expense.description;
      categoryCell.textContent = expense.category;
      amountCell.textContent = `$${expense.amount.toFixed(2)}`;

      row.appendChild(descriptionCell);
      row.appendChild(categoryCell);
      row.appendChild(amountCell);
      table.appendChild(row);
    });
    Total.textContent = `$${response?.data?.totalExpense.toFixed(2)}`;
    const expenseName = document.getElementById("expenseName");
    expenseName.textContent = timeframe.charAt(0).toUpperCase() + timeframe.slice(1);
  } catch (error) {
    console.error(error);
    alert("You are not a premium member");
    window.location.href = "/";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  fetchExpenseReport("daily");

  const tabs = document.querySelectorAll("ul li a");

  tabs.forEach((tab) => {
    tab.addEventListener("click", (event) => {
      event.preventDefault();

      const timeframe = tab.id;


      fetchExpenseReport(timeframe);
    });
  });
});
