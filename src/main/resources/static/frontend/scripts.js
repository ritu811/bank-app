document.addEventListener('DOMContentLoaded', () => {
    const content = document.getElementById('content');

    // Initial load of home content
    loadHome();

    // Event listener for navigation links using event delegation
    document.querySelector('nav ul').addEventListener('click', (event) => {
        if (event.target.tagName === 'A') {
            const id = event.target.id;
            switch (id) {
                case 'home':
                    loadHome();
                    break;
                case 'viewAccount':
                    loadViewAccount();
                    break;
                case 'deposit':
                    loadDeposit();
                    break;
                case 'withdraw':
                    loadWithdraw();
                    break;
                case 'addAccount':
                    loadAddAccount();
                    break;
                case 'removeAccount':
                    loadRemoveAccount();
                    break;
                default:
                    // Handle unexpected cases or do nothing
                    break;
            }
        }
    });

    // Function to load home content
    function loadHome() {
        content.innerHTML = `
            <h1>Welcome to Smart Bank</h1>

        `;
    }

    // Function to load view account content
    function loadViewAccount() {
        content.innerHTML = `
            <h2>View Account</h2>
            <form id="viewAccountForm">
                <input type="number" id="accountId" placeholder="Enter Account ID" required>
                <button type="submit">View Account</button>
            </form>
            <div id="accountDetails"></div>
        `;
        // Add event listener to form submission
        document.getElementById('viewAccountForm').addEventListener('submit', (event) => {
            event.preventDefault();
            const accountId = document.getElementById('accountId').value;
            fetch(`http://localhost:8080/api/accounts/${accountId}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Account not found');
                    }
                    return response.json();
                })
                .then(account => {
                    // Display account details
                    const accountDetails = document.getElementById('accountDetails');
                    accountDetails.innerHTML = `
                        <p>Account ID: ${account.id}</p>
                        <p>Account Holder: ${account.accountHolderName}</p>
                        <p>Balance: $${account.balance}</p>
                    `;
                })
                .catch(error => {
                    const accountDetails = document.getElementById('accountDetails');
                    accountDetails.innerHTML = `<p>${error.message}</p>`;
                });
        });
    }

    // Function to load deposit content
    function loadDeposit() {
        content.innerHTML = `
            <h2>Deposit</h2>
            <form id="depositForm">
                <input type="number" id="accountId" placeholder="Account ID" required>
                <input type="number" id="amount" placeholder="Amount" required>
                <button type="submit">Deposit</button>
            </form>
            <div id="depositMessage"></div>
        `;
        document.getElementById('depositForm').addEventListener('submit', (event) => {
            event.preventDefault();
            const accountId = document.getElementById('accountId').value;
            const amount = document.getElementById('amount').value;
            fetch(`http://localhost:8080/api/accounts/${accountId}/deposit`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ amount: parseFloat(amount) })
            })
            .then(response => response.json())
            .then(account => {
                const depositMessage = document.getElementById('depositMessage');
                depositMessage.innerHTML = `<p>New Balance: $${account.balance}</p>`;
            })
            .catch(error => console.error('Error depositing amount:', error));
        });
    }

    // Function to load withdraw content
    function loadWithdraw() {
        content.innerHTML = `
            <h2>Withdraw</h2>
            <form id="withdrawForm">
                <input type="number" id="accountId" placeholder="Account ID" required>
                <input type="number" id="amount" placeholder="Amount" required>
                <button type="submit">Withdraw</button>
            </form>
            <div id="withdrawMessage"></div>
        `;
        document.getElementById('withdrawForm').addEventListener('submit', (event) => {
            event.preventDefault();
            const accountId = document.getElementById('accountId').value;
            const amount = document.getElementById('amount').value;
            fetch(`http://localhost:8080/api/accounts/${accountId}/withdraw`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ amount: parseFloat(amount) })
            })
            .then(response => response.json())
            .then(account => {
                const withdrawMessage = document.getElementById('withdrawMessage');
                withdrawMessage.innerHTML = `<p>New Balance: $${account.balance}</p>`;
            })
            .catch(error => console.error('Error withdrawing amount:', error));
        });
    }

    // Function to load add account content
    function loadAddAccount() {
        content.innerHTML = `
            <h2>Add Account</h2>
            <form id="addAccountForm">
                <input type="text" id="accountHolderName" placeholder="Account Holder Name" required>
                <input type="number" id="initialBalance" placeholder="Initial Balance" required>
                <button type="submit">Add Account</button>
            </form>
            <div id="addAccountMessage"></div>
        `;
        document.getElementById('addAccountForm').addEventListener('submit', (event) => {
            event.preventDefault();
            const accountHolderName = document.getElementById('accountHolderName').value;
            const initialBalance = document.getElementById('initialBalance').value;
            fetch(`http://localhost:8080/api/accounts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    accountHolderName: accountHolderName,
                    balance: parseFloat(initialBalance)
                })
            })
            .then(response => response.json())
            .then(account => {
                const addAccountMessage = document.getElementById('addAccountMessage');
                addAccountMessage.innerHTML = `
                    <p>Account ID: ${account.id}</p>
                    <p>Account Holder: ${account.accountHolderName}</p>
                    <p>Balance: $${account.balance}</p>
                `;
            })
            .catch(error => console.error('Error adding account:', error));
        });
    }

    // Function to load remove account content
    function loadRemoveAccount() {
        content.innerHTML = `
            <h2>Remove Account</h2>
            <form id="removeAccountForm">
                <input type="number" id="accountId" placeholder="Account ID" required>
                <button type="submit">Remove Account</button>
            </form>
            <div id="removeAccountMessage"></div>
        `;
        document.getElementById('removeAccountForm').addEventListener('submit', (event) => {
            event.preventDefault();
            const accountId = document.getElementById('accountId').value;
            fetch(`http://localhost:8080/api/accounts/${accountId}`, {
                method: 'DELETE'
            })
            .then(response => {
                const removeAccountMessage = document.getElementById('removeAccountMessage');
                if (response.ok) {
                    removeAccountMessage.innerHTML = '<p>Account deleted successfully.</p>';
                } else {
                    throw new Error('Failed to delete account.');
                }
            })
            .catch(error => console.error('Error deleting account:', error));
        });
    }
});
