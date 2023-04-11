// app.js
const form = document.getElementById('expense-form');
const descriptionInput = document.getElementById('description');
const buyButton = document.getElementById('buy');
const categoryInput = document.getElementById('category');
const amountInput = document.getElementById('amount');
const expenseList = document.getElementById('expense-list');
let token = null ;

buyButton.addEventListener('click',async()=>{
 try {
  const res = await axios.get('/api/order',{
    headers: {
      'Authorization': `Bearer ${token}` 
    }
  })
  console.log(res.data)
  var options = {
    "key": res.data.key_id,
    "order_id": res.data.order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
    "handler" : async function(response){
      try {
        console.log(response);
      await axios.post('http://localhost:3000/api/order/complete',{
        orderId: options.order_id,
        paymentId: response.razorpay_payment_id
      },{
        headers: {
          'Authorization': `Bearer ${token}`
          }
          })
          alert("Payment Successfully")
      } catch (error) {
        console.log(error)
      }
    }
};
var rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();
    rzp1.on('payment.failed',()=>{
      alert("Payment Failed")
    })
 } catch (error) {
  console.log(error)
 }
  
})

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
