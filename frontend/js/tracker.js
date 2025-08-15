const API_URL = 'http://localhost:5000/api/expenses';

document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.getElementById("table-body");
  const totalIncomeEl = document.getElementById("totalIncome");
  const totalExpenseEl = document.getElementById("expense");
  const balanceEl = document.getElementById("balance");

  // Load initial data
  loadExpenses();
  loadSummary();

  async function loadExpenses() {
    try {
      const response = await axios.get(API_URL);
      renderExpenses(response.data);
    } catch (error) {
      console.error("Error loading expenses:", error);
    }
  }

  async function loadSummary() {
    try {
      const response = await axios.get(`${API_URL}/summary`);
      updateTotals(response.data);
    } catch (error) {
      console.error("Error loading summary:", error);
    }
  }

  function renderExpenses(expenses) {
    tableBody.innerHTML = '';
    
    expenses.forEach(expense => {
      const row = document.createElement('tr');
      row.dataset.id = expense._id;
      
      row.innerHTML = `
        <td>${expense.amount}</td>
        <td>${expense.type}</td>
        <td>${new Date(expense.date).toLocaleDateString()}</td>
        <td>
          <button class="delete-button">
            <img src="./bin.png" style="width:20px;height:20px;">
          </button>
        </td>
      `;
      
      row.querySelector('.delete-button').addEventListener('click', () => deleteExpense(expense._id));
      tableBody.appendChild(row);
    });
  }

  function updateTotals(summary) {
    totalIncomeEl.innerText = summary.income;
    totalExpenseEl.innerText = summary.expense;
    balanceEl.innerText = summary.balance;
  }

  async function deleteExpense(id) {
    try {
      await axios.delete(`${API_URL}/${id}`);
      loadExpenses();
      loadSummary();
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  }

  window.addRow = async function() {
    const date = document.querySelector(".dateInput").value;
    const amount = Number(document.querySelector(".amountInput").value);
    const transactionType = document.querySelector(".transactionType").value;

    if (!date || isNaN(amount) || amount <= 0) {
      alert("Please enter valid date and amount.");
      return;
    }

    try {
      await axios.post(API_URL, {
        amount,
        type: transactionType,
        date: new Date(date)
      });
      
      // Clear inputs
      document.querySelector(".dateInput").value = '';
      document.querySelector(".amountInput").value = '';
      
      // Refresh data
      loadExpenses();
      loadSummary();
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };
});