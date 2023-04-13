// app.js
const form = document.getElementById('expense-form');
const descriptionInput = document.getElementById('description');
const buyButton = document.getElementById('buy');
const categoryInput = document.getElementById('category');
const amountInput = document.getElementById('amount');
const expenseList = document.getElementById('expense-list');
const logout = document.getElementById('logout')
let token = null ;
let user = null;
let currentPage = 1; // current page number
let selectButton = document.getElementById("select-option");
let perPage = 10;
let expenses = []; // array of expenses
let paginationData ={};

logout.onclick = ()=>{
  localStorage.removeItem('token');
  token = null;
  window.location.href = '/signin'
}
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
      await axios.post('http://localhost:3000/api/order',{
        orderId: options.order_id,
        paymentId: response.razorpay_payment_id
      },{
        headers: {
          'Authorization': `Bearer ${token}`
          }
          })
          alert("Payment Successfully")
          fetchExp();
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
    fetchExp();

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
const renderPagination = () => {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";
  const totalPages = paginationData.totalPages
  for (let i = 1; i <= totalPages; i++) {
    const link = document.createElement("a");
    link.href = "#";
    link.textContent = i;
    if (i === currentPage) {
      link.classList.add("active");
    }
    link.addEventListener("click", (event) => {
      event.preventDefault();
      currentPage = i;
      fetchExp();
    });
    pagination.appendChild(link);
  }
};
async function fetchExp(){
  const res = await axios.post('/api/expense/getall',{
    page:currentPage,
    perPage,
  },{
    headers: {
      'Authorization': `Bearer ${token}` 
    }
  });
  user = res.data.user;
  if(!user) window.location.href = '/signin';
  expenses = res.data.expenses;
  paginationData = res.data.pagination;
  console.log(res.data)
  const premiumBox = document.getElementById('premium');
  const alertPremium = document.getElementById('alertPremium');
  if(user.premium){
    premiumBox.style.display = 'none';
    alertPremium.innerHTML = `${user.name} is a premium member`;
  }else{
    alertPremium.innerHTML = `${user.name} is not a premium member`;
    premiumBox.style.display = 'block'
  }
  expenseList.innerHTML = ""
      expenses.forEach(expense => {
        const li = document.createElement('li');
        li.textContent = `${expense.description} - $${expense.amount} - ${expense.category}`;
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete-button');
        deleteButton.addEventListener('click', () => deleteExpense(expense.id, li));
        li.appendChild(deleteButton);
        expenseList.appendChild(li);
      });
  renderPagination();
}
selectButton.addEventListener('change',(e)=>{
  perPage = e.target.value
  fetchExp();
})
window.addEventListener('DOMContentLoaded', async () => {
    try {
      token = localStorage.getItem('token');
      if(token){
        await fetchExp();
      }else{
        window.location.href = '/signin';
      }
    } catch (error) {
      console.error(error);
    }
  });
