document.addEventListener('DOMContentLoaded', async () => {
    const ledgerTable = document.getElementById('ledgerTable');
    const paginationContainer = document.getElementById('paginationContainer');
    const username = sessionStorage.getItem('username');
    const welcomeMessage = document.getElementById('welcome-message');
    const totalBalance = document.getElementById('total-balance');
    const lastOrder = document.getElementById('last-order');
    const lastPayment = document.getElementById('last-payment');
    const viewLedgerButton = document.getElementById('viewLedgerButton');
    const ledgerContainer = document.getElementById('ledgerContainer');
    const payButton = document.getElementById('payButton');

    // Check authentication
    if (!sessionStorage.getItem('isAuthenticated') || sessionStorage.getItem('userType') !== 'customer') {
        window.location.href = '../index.html';
        return;
    }

    welcomeMessage.textContent = `Hello, ${username}!`;

    // Load customer ledger
    const ledger = await window.getLedger();
    const userLedger = ledger.filter(row => row[0] === username);
const userLedger1 = ledger.filter(row => row[0] === username);
    if (userLedger.length > 0) {
        // Display total outstanding balance
        const lastRow = userLedger[userLedger.length - 1];
        totalBalance.textContent = `Your Total Outstanding Balance is: ${lastRow[lastRow.length - 1]}`;

        // Find last order
      const today = new Date();
      const saleDates = userLedger
      .filter(row => row[2] === 'Sale')
      .map(row => new Date(row[1]));
       const latestDateBeforeToday = saleDates
       .filter(date => date < today)
      .sort((a,b) => b.date -a.date)[0];
      lastOrder.textContent = `Your Last Order was ${latestDateBeforeToday.row[3]} amounting ${latestDateBeforeToday.row[4]} on ${latestDateBeforeToday.row[1]}`;
      
      
      // Log the filtered sales data to the console
     // console.log('Filtered Sales Data:', saleDates);
   //    console.log('Filtered Sales along with last sale Data:', latestDateBeforeToday);
      //const lastOrderRow = filteredSales
     //    .map(row => ({ row, date: new Date(row[1]) }))
     //     .filter(({ date }) => date < today)
      //    .sort((b, a) => a.date - b.date)[0];
      
     // if (lastOrderRow) {
    //      lastOrder.textContent = `Your Last Order was ${lastOrderRow.row[3]} amounting ${lastOrderRow.row[4]} on ${lastOrderRow.row[1]}`;
    //  } else {
   //       lastOrder.textContent = 'No orders found.';
  //    }
      
    //  const today = new Date();
     // const lastOrderRow = userLedger
      //    .filter(row => row[2] === 'Sale')
     //     .map(row => ({ row, date: new Date(row[1]) }))
     //     .filter(({ date }) => date < today)
     //     .sort((b, a) => a.date - b.date)[0];
      
   //   if (lastOrderRow) {
       //   lastOrder.textContent = `Your Last Order was ${lastOrderRow.row[3]} amounting ${lastOrderRow.row[4]} on ${lastOrderRow.row[1]}`;
   //   } else {
      //   lastOrder.textContent = 'No orders found.';
    //  }

        // Find last payment
        const lastPaymentRow = userLedger1
            .filter(row => row[2] === 'Rcpt')
            .map(row => ({ row, date: new Date(row[1]) }))
            .filter(({ date }) => date <= today)
            .sort((a, b) => b.date - a.date)[0];

     
            lastPayment.textContent = `Your Last Payment was ${lastPaymentRow.row[3]} amounting ${lastPaymentRow.row[5]} on ${lastPaymentRow.row[1]}`;
     
    }

    // Populate ledger table on button click
    viewLedgerButton.addEventListener('click', () => {
        ledgerContainer.style.display = 'block';
        ledgerTable.querySelector('tbody').innerHTML = ''; // Clear existing rows
        userLedger.forEach(row => {
            const tr = document.createElement('tr');
            row.slice(1).forEach(cell => {
                const td = document.createElement('td');
                td.textContent = cell;
                tr.appendChild(td);
            });
            ledgerTable.querySelector('tbody').appendChild(tr);
        });
        paginateTable(ledgerTable, paginationContainer, 10); // Apply pagination
    });

    // Redirect to payment page on pay button click
    payButton.addEventListener('click', () => {
        const paymentAmount = document.getElementById('paymentAmount').value;
        if (paymentAmount) {
            sessionStorage.setItem('paymentAmount', paymentAmount);
            window.location.href = 'payment.html';
        } else {
            alert('Please enter a payment amount.');
        }
    });

    // Logout functionality
   // window.logout = () => {
     //   sessionStorage.clear();
      //  window.location.href = '../index.html';
   // };
});