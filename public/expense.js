// app.js
const form = document.getElementById('expense-form');
const descriptionInput = document.getElementById('description');
const categoryInput = document.getElementById('category');
const amountInput = document.getElementById('amount');
const expenseList = document.getElementById('expense-list');
let token = null ;

form.addEventListener('submit', addExpense);
async function addExpense(event) {
  event.preventDefault();
  const description = descriptionInput.value;
  const category = categoryInput.value;
  const amount = parseFloat(amountInput.value);

  try {
    // Create new expense in database
    const res = await axios.post('api/expense',{
        description,
        amount,
        category,
    },{
      headers: {
        'Authorization': `Bearer ${token}` 
      }
    });
    console.log(res);
    // Add expense to UI
    const li = document.createElement('li');
    li.textContent = `${res.data.description} - $${res.data.amount} - ${res.data.category}`;
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-button');
    deleteButton.addEventListener('click', () => deleteExpense(res.data.id, li));
    li.appendChild(deleteButton);
    expenseList.appendChild(li);

    // Clear form inputs
    descriptionInput.value = '';
    categoryInput.value = '';
    amountInput.value = '';

  } catch (error) {
    console.error(error);
  }
}

// Delete expense from database and UI
async function deleteExpense(id, li) {
  try {
    // Delete expense from database
    const res = await axios.delete('api/expense/' + id, {
      headers: {
        'Authorization': `Bearer ${token}`
        }
        });
    // Remove expense from UI
    li.remove();

  } catch (error) {
    console.error(error);
  }
}
const fetchExp = async()=>{
  const res = await axios.get('/api/expense',{
    headers: {
      'Authorization': `Bearer ${token}` 
    }
  });
      res?.data?.forEach(expense => {
        const li = document.createElement('li');
        li.textContent = `${expense.description} - $${expense.amount} - ${expense.category}`;
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete-button');
        deleteButton.addEventListener('click', () => deleteExpense(expense.id, li));
        li.appendChild(deleteButton);
        expenseList.appendChild(li);
      });
}
window.addEventListener('load', async () => {
    try {
      token = localStorage.getItem('token');
      if(token){
        fetchExp();
      }else{
        window.location.href = '/signin';
      }
    } catch (error) {
      console.error(error);
    }
  });
