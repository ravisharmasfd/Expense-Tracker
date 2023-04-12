const dailyTable = document.querySelector('#daily-expense-list');
const dailyTotal = document.querySelector('#daily-total');
const weeklyTable = document.querySelector('#weekly-expense-list');
const weeklyTotal = document.querySelector('#weekly-total');
const monthlyTable = document.querySelector('#monthly-expense-list');
const monthlyTotal = document.querySelector('#monthly-total');
const yearlyTable = document.querySelector('#yearly-expense-list');
const yearlyTotal = document.querySelector('#yearly-total');

function fetchExpenseReport(timeframe) {
  axios.get('/api/expense/report', { timeframe })
    .then(response => {
      const expenses = response.data.expenses;
      let total = 0;
      const table = getTimeframeTable(timeframe);

      table.innerHTML = '';

      expenses.forEach(expense => {
        const row = document.createElement('tr');
        const descriptionCell = document.createElement('td');
        const categoryCell = document.createElement('td');
        const amountCell = document.createElement('td');

        descriptionCell.textContent = expense.description;
        categoryCell.textContent = expense.category;
        amountCell.textContent = `$${expense.amount.toFixed(2)}`;

        row.appendChild(descriptionCell);
        row.appendChild(categoryCell);
        row.appendChild(amountCell);
        table.appendChild(row);

        total += expense.amount;
      });

      getTimeframeTotal(timeframe).textContent = `$${total.toFixed(2)}`;
    })
    .catch(error => {
      console.error(error);
      alert("You are not a premium member");
      window.location.href = "/"
    });
}

function getTimeframeTable(timeframe) {
  switch (timeframe) {
    case 'daily':
      return dailyTable;
    case 'weekly':
      return weeklyTable;
    case 'monthly':
      return monthlyTable;
    case 'yearly':
      return yearlyTable;
  }
}

function getTimeframeTotal(timeframe) {
  switch (timeframe) {
    case 'daily':
      return dailyTotal;
    case 'weekly':
      return weeklyTotal;
    case 'monthly':
      return monthlyTotal;
    case 'yearly':
      return yearlyTotal;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  fetchExpenseReport('daily');

  const tabs = document.querySelectorAll('ul li a');

  tabs.forEach(tab => {
    tab.addEventListener('click', event => {
      event.preventDefault();

      const timeframe = tab.getAttribute('href').substring(1);

      fetchExpenseReport(timeframe);
    });
  });
});
