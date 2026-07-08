let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

const list = document.getElementById("transactionList");
const balanceEl = document.getElementById("totalBalance");
const incomeEl = document.getElementById("totalIncome");
const expenseEl = document.getElementById("totalExpense");

const form = document.getElementById("financeForm");

const ctxBar = document.getElementById("barChart");
const ctxDoughnut = document.getElementById("doughnutChart");
const ctxLine = document.getElementById("lineChart");

let barChart, doughnutChart, lineChart;

const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR"
    }).format(amount);
};

function update() {
    let income = 0;
    let expense = 0;
    list.innerHTML = "";
    transactions.forEach(t => {
        if (t.type === "income") {
            income += t.amount;
        } else {
            expense += t.amount;
        }
        list.innerHTML += `
            <tr>
                <td>${t.date}</td>
                <td>${t.description}</td>
                <td>${t.category}</td>
                <td>${formatCurrency(t.amount)}</td>
                <td>
                    <button class="delete" onclick="deleteTx(${t.id})">X</button>
                </td>
            </tr>
        `;
    });

    balanceEl.innerText = formatCurrency(income - expense);
    incomeEl.innerText = formatCurrency(income);
    expenseEl.innerText = formatCurrency(expense);
    localStorage.setItem("transactions", JSON.stringify(transactions));
    updateCharts(income, expense);
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const transaction = {
        id: Date.now(),
        description: description.value,
        amount: +amount.value,
        type: type.value,
        category: category.value,
        date: date.value
    };
    transactions.push(transaction);
    update();
    form.reset();
});

function deleteTx(id) {
    transactions = transactions.filter(t => t.id !== id);
    update();
}

function updateCharts(income, expense) {
    if (barChart) barChart.destroy();
    barChart = new Chart(ctxBar, {
        type: "bar",
        data: {
            labels: ["Income", "Expense"],
            datasets: [{
                data: [income, expense],
                backgroundColor: ["#06d6a0", "#ef476f"]
            }]
        }
    });

    const categories = {};
    transactions.forEach(t => {
        if (t.type === "expense") {
            categories[t.category] =
                (categories[t.category] || 0) + t.amount;
        }
    });

    if (doughnutChart) doughnutChart.destroy();

    doughnutChart = new Chart(ctxDoughnut, {
        type: "doughnut",
        data: {
            labels: Object.keys(categories),
            datasets: [{
                data: Object.values(categories)
            }]
        }
    });

    let balance = 0;
    const trend = [];
    transactions.forEach(t => {
        balance += t.type === "income"
            ? t.amount
            : -t.amount;
        trend.push(balance);
    });

    if (lineChart) lineChart.destroy();
    lineChart = new Chart(ctxLine, {
        type: "line",
        data: {
            labels: transactions.map(t => t.date),
            datasets: [{
                data: trend,
                borderColor: "#4361ee",
                fill: true
            }]
        }
    });
}

document.getElementById("darkModeToggle").onclick = () => {
    document.body.toggleAttribute("data-theme");
};
document.getElementById("currentDate").innerText =
    new Date().toDateString();
update();