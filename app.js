const list = document.querySelector(".list");
const form = document.querySelector(".form");
const desc = document.querySelector("#desc");
const amount = document.querySelector("#amount");
const income = document.querySelector("#income");
const expence = document.querySelector("#expence");
const total = document.querySelector("#total");

let totalIncome = 0;
let totalExpense = 0;
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

form.addEventListener("submit", (e) => {
    e.preventDefault();
    checkInput();
    displayTotal();
});

function saveToLocalStorage(transactions) {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function checkInput() {
    const descVal = desc.value.trim();
    const amountVal = amount.value.trim();
    const amountNumber = parseFloat(amountVal);

    if (descVal === "" && amountVal === "") {
        alert("enter transaction amount and give it a name");
    } else if (descVal === "" && amountVal !== "") {
        alert("please give the transaction a name");
    } else if (descVal !== "" && amountVal === "") {
        alert("please give the amount");
    } else {
        const transaction = {
            desc: descVal,
            amount: amountNumber,
        };
        transactions.push(transaction);
        saveToLocalStorage(transactions);

        list.innerHTML += `<li class="list-item">
            <div class="list-text">
                <p>${descVal}</p>
            </div>
            <div class="list-value">
                <span>${amountVal}</span>
            </div>
            <div class="del-btn hidden" onclick="removeItem(this, ${amountNumber})">
                x
            </div>
        </li>`;
        updateTotals(amountNumber);
    }
    desc.value = "";
    amount.value = "";
}

function updateTotals(amount) {
    if (amount > 0) {
        totalIncome += amount;
        income.textContent = totalIncome;
    } else if (amount < 0) {
        totalExpense += amount;
        expence.textContent = totalExpense;
    }
}

function displayTotal() {
    const totalNo = totalIncome + totalExpense;
    total.textContent = totalNo;
    if (totalNo > 0) {
        total.style.color = "green";
    } else if (totalNo < 0) {
        total.style.color = "red";
    }
}

function loadTransactions() {
    const storedTransactions = JSON.parse(localStorage.getItem('transactions')) || [];
    totalIncome = 0;
    totalExpense = 0;

    storedTransactions.forEach(transaction => {
        list.innerHTML += `<li class="list-item">
            <div class="list-text">
                <p>${transaction.desc}</p>
            </div>
            <div class="list-value">
                <span>${transaction.amount}</span>
            </div>
            <div class="del-btn hidden" onclick="removeItem(this, ${transaction.amount})">
                x
            </div>
        </li>`;
        updateTotals(transaction.amount);
    });
    displayTotal();
}

document.addEventListener('DOMContentLoaded', loadTransactions);

function removeItem(element, amount) {
    const desc = element.parentElement.querySelector('.list-text p').textContent;
    transactions = transactions.filter(transaction => transaction.desc !== desc || transaction.amount !== amount);
    saveToLocalStorage(transactions);

    element.parentElement.remove();
    if (amount > 0) {
        totalIncome -= amount;
        income.textContent = totalIncome;
    } else if (amount < 0) {
        totalExpense -= amount;
        expence.textContent = totalExpense;
    }
    displayTotal();
}
