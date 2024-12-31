document.addEventListener('DOMContentLoaded', async () => {
    // Existing code...

    const orderButton = document.getElementById('orderButton');
    const orderContainer = document.getElementById('orderContainer');
    const companySelect = document.getElementById('companySelect');
    const stockTableContainer = document.getElementById('stockTableContainer');
    const stockTableBody = document.getElementById('stockTable').querySelector('tbody');
    const confirmOrderButton = document.getElementById('confirmOrderButton');
    const cartContainer = document.getElementById('cartContainer');
    const cartList = document.getElementById('cartList');
    const totalAmount = document.getElementById('totalAmount');
    const finalizeOrderButton = document.getElementById('finalizeOrderButton');

    let cart = [];

    // Fetch company names and populate the dropdown
    const stockData = await window.getStockData();
    const companyNames = [...new Set(stockData.map(row => row[0]))];
    companyNames.forEach(company => {
        const option = document.createElement('option');
        option.value = company;
        option.textContent = company;
        companySelect.appendChild(option);
    });

    orderButton.addEventListener('click', () => {
        orderContainer.style.display = 'block';
    });

    companySelect.addEventListener('change', () => {
        const selectedCompany = companySelect.value;
        if (selectedCompany) {
            const companyItems = stockData.filter(row => row[0] === selectedCompany && parseFloat(row[4]) > 0);
            stockTableBody.innerHTML = '';
            companyItems.forEach(item => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${item[1]}</td>
                    <td>${item[2]}</td>
                    <td>${item[3]}</td>
                    <td>${item[4]}</td>
                    <td><input type="number" class="form-control quantity-input quantity-input-small" data-item="${item[1]}" data-rate="${item[2]}" min="1"></td>
                    <td><button class="btn btn-sm btn-primary add-to-cart-button" data-item="${item[1]}" data-rate="${item[2]}">Add</button></td>
                `;
                stockTableBody.appendChild(tr);
            });
            stockTableContainer.style.display = 'block';
            confirmOrderButton.style.display = 'block';
        } else {
            stockTableContainer.style.display = 'none';
            confirmOrderButton.style.display = 'none';
        }
    });
    
    stockTableBody.addEventListener('click', (event) => {
        if (event.target.classList.contains('add-to-cart-button')) {
            const item = event.target.getAttribute('data-item');
            const rate = parseFloat(event.target.getAttribute('data-rate'));
            const quantityInput = stockTableBody.querySelector(`.quantity-input[data-item="${item}"]`);
            const quantity = parseInt(quantityInput.value);
            if (quantity > 0) {
                cart.push({ item, rate, quantity });
                updateCart();
            } else {
                alert('Please enter a valid quantity.');
            }
        }
    });


    confirmOrderButton.addEventListener('click', () => {
        cartContainer.style.display = 'block';
        updateCart();
    });

    finalizeOrderButton.addEventListener('click', () => {
        const orderDetails = cart.map(item => `${item.quantity} x ${item.item} @ ${item.rate}`).join('\n');
        const total = cart.reduce((sum, item) => sum + item.rate * item.quantity, 0);
        const message = `Order Details:\n${orderDetails}\nTotal Amount: ${total}`;
        const whatsappUrl = `https://wa.me/9533762508?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    });

    function updateCart() {
        cartList.innerHTML = '';
        cart.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.quantity} x ${item.item} @ ${item.rate}`;
            cartList.appendChild(li);
        });
        const total = cart.reduce((sum, item) => sum + item.rate * item.quantity, 0);
        totalAmount.textContent = `Total Amount: ${total}`;
    }
});