const token = localStorage.getItem('token');

async function submitForm(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const expenseDetails = {
        amount: formData.get('amount'),
        description: formData.get('description'),
        category: formData.get('category'),
    };
    try {
        const response = await axios.post('http://localhost:8000/expense/addExpense', expenseDetails, {headers: { "Authorization": token }});
        event.target.reset();
        alert('Expense added successfully');
        displayExpenses(response.data.expense);
    } catch (error) {
        console.error('Error adding expense:', error);
        alert('An error occurred. Please try again.');
    };
}
 

async function displayExpenses(expense) {
    document.getElementById('expHead').style.display = 'block';
    const expenseList = document.getElementById('expenseList');
    const li = document.createElement('li');
    li.textContent = `${expense.amount} - ${expense.description} - ${expense.category} `;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'DELETE';
    deleteBtn.classList.add('deleteBtn');

    li.appendChild(deleteBtn);
    expenseList.appendChild(li);

    deleteBtn.onclick = async () => {
        try {
            displayPremiumStatus();
            displayRecords();
            await axios.delete(`http://localhost:8000/expense/${expense._id}`, { headers: { "Authorization": token }  });
            li.remove();
            alert('Expense deleted successfully');
            //fetchExpenses()
        } catch (error) {
            console.error('Deletion failed:', error);
            alert('An error occurred while deleting the expense.');
        }
    };
}


async function fetchExpenses(page=1){
    const pageSize= localStorage.getItem('pageSize') || 5 ;
    try{
        const response = await axios.get(`http://localhost:8000/expense/getExpense?page=${page}&pageSize=${pageSize}`, { headers: { "Authorization": token } });
      
        const expenseList = document.getElementById('expenseList');
        expenseList.innerHTML = ''; // Clear existing list

        response.data.expenses.forEach(expense => displayExpenses(expense));

        const paginationDiv = document.getElementById('paginateExpense');
        paginationDiv.innerHTML = ''; // Clear existing pagination

        for (let i = 1; i <= response.data.totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            if (i === parseInt(page)) {
                pageButton.disabled = true; // Disable current page button
            }
            pageButton.onclick = () => fetchExpenses(i);
            paginationDiv.appendChild(pageButton);
        }
    }catch (error) {
        console.error('Error fetching data:', error);
        alert('An error occurred. Please try again.');
    }
}

function updatePageSize(){
    const pageSize = document.getElementById('pageSize').value;
    localStorage.setItem('pageSize' , pageSize)
    fetchExpenses(1)

}

document.addEventListener('DOMContentLoaded', async () => {
    
    const savedPageSize = localStorage.getItem('pageSize') || 5;
    document.getElementById('pageSize').value = savedPageSize;
    fetchExpenses(1)
    displayPremiumStatus();
    displayRecords()
});


document.getElementById('premium').onclick = async function(event) {
    try {
        const response = await axios.get('http://localhost:8000/purchase/premiumPurchase', {  headers: { 'Authorization': token }  });
        var options = {
            'key': response.data.key_id,
            'order_id': response.data.order.id,
            'amount': response.data.order.amount,
            'currency': 'INR',
            'description': "Premium Subscription",
            'name': 'Expense Tracker App',
            'handler': async function(response) {
                try {
                    const updateTransactionStatus = await axios.post('http://localhost:8000/purchase/updateTransactionStatus', {
                        order_id: options.order_id,payment_id: response.razorpay_payment_id }, { headers: { 'Authorization': token } });
                    displayPremiumStatus();
                    alert('Congratulations! You are now a Premium User.');
                } catch (error) {
                    console.error('Error while updating transaction status:', error);
                    alert('An error occurred while updating transaction status.');
                }
            }
        };
        const rzp1 = new Razorpay(options);
        rzp1.open();
        event.preventDefault();

        rzp1.on('payment.failed', async function(response) {
            try {
                console.log(response)
                const updateOrderStatus = await axios.post('http://localhost:8000/purchase/updateOrderStatus', {
                     order_id: options.order_id }, { headers: { 'Authorization': token } });
                alert('Payment failed. Order status has been updated.');
            } catch (error) {
                console.error('Error updating order status:', error);
                alert('An error occurred while updating order status.');
            }
        });
    } catch (error) {
        console.error('Error initiating premium purchase:', error);
        alert('An error occurred while initiating premium purchase.');
    }
};

document.getElementById('leaderButton').onclick = async function(event) {
    try {
        const response = await axios.get('http://localhost:8000/premium/showLeaderBoard', {  headers: { 'Authorization': token } });
        const resData = response.data;
        const leaderBoard = document.getElementById('leaderBoard');
        leaderBoard.innerHTML = '';
        resData.forEach(user => {
            const li = document.createElement('li');
            li.innerHTML = `Name - ${user.name}, Total expense - ${user.totalCost}`;
            leaderBoard.appendChild(li);
        });
        document.getElementById('leaderMessage').style.display = 'block';
    } catch (error) {
        console.error('Error fetching leaderboard data:', error);
        alert('You are not a premium user');
    }
};

async function displayPremiumStatus() {
    try {
        const statusResponse = await axios.get('http://localhost:8000/purchase/getStatus', { headers: { 'Authorization': token } });
        const isPremium = statusResponse.data.status;
        const premiumMsg = document.getElementById('premiumMsg');
        if (isPremium ) {
            document.getElementById('premium').style.display = 'none';
            premiumMsg.innerHTML = 'Premium User';
            displayRecords();
        } else {
            premiumMsg.innerHTML = 'You are not a premium user';     
        }
    } catch (error) {
        console.error(error);
        alert(error);
    }
}

document.getElementById('downloadBtn').onclick = async function(event) {
    try {
        const response = await axios.get('http://localhost:8000/premium/download', { headers: { 'Authorization': token } });
        if (response.status === 201) {
            const a = document.createElement('a');
            a.href = response.data.Location;
            a.download = 'myexpense.csv';
            a.click();
        }
        displayRecords();
    } catch (error) {
        console.error('Error downloading file:', error.response.data.message);
        alert('An error occurred while downloading',error);
        throw new Error(error);
    }
}

async function displayRecords() {
    try {
        document.getElementById('recordsDiv').style.display = 'block';
        const record = await axios.get('http://localhost:8000/premium/downloadRecords', {headers: { 'Authorization': token } });
       
        document.getElementById('records').innerHTML = '';
        record.data.forEach(records => {
            const ul=document.getElementById('records')
            const li = document.createElement('li');
            li.textContent = `${records.downloadedAt} -` ;

            const dlink = document.createElement('a');
            dlink.href = records.url;
            dlink.textContent = 'Download';
            dlink.download = 'myexpense.csv';

            li.appendChild(dlink);
            ul.appendChild(li);
        });
    } catch (error) {
        console.error(error);
    }
}