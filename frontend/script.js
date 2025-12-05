if (!localStorage.getItem("token2")) {
    window.location.href = "/login.html"
}
Chart.defaults.font.family = "Inter, system-ui, sans-serif";
Chart.defaults.font.size = 12;
Chart.defaults.color = "#cbd5f5";


function formatDate(dateStr) {
    const [year, month, day] = dateStr.split("-");
    return `${day}-${month}-${year}`;
}


function updateSummary() {
    if (!kharcha.length) return;

    let total = 0;

    for (let i = 0; i < kharcha.length; i++) {
        total += Number(kharcha[i].amount);
    }

    document.getElementById("totalAmount").innerText = `₹ ${total}`;

    document.getElementById("totalCount").innerText = kharcha.length;

    const map = {};
    kharcha.forEach(i => map[i.category] = (map[i.category] || 0) + i.amount);
    const top = Object.keys(map).sort((a, b) => map[b] - map[a])[0]; // sabse badi category de dega 
    document.getElementById("topCategory").innerText = top || "—";
}



let kharcha = [];
let pieChart = null;
let barChart = null;
let lineChart = null;


function updateCharts() {
    if (!kharcha.length) return;

    const pieCtx = document.getElementById("expensePieChart");
    const barCtx = document.getElementById("expenseBarChart");
    const lineCtx = document.getElementById("expenseLineChart");

    // ---------- Group by CATEGORY ----------
    const categoryTotals = {};
    kharcha.forEach(item => {
        categoryTotals[item.category] =
            (categoryTotals[item.category] || 0) + Number(item.amount);
    });

    const catLabels = Object.keys(categoryTotals);
    const catValues = Object.values(categoryTotals);

    // ---------- Group by DATE (for line chart) ----------
    const dateTotals = {};
    kharcha.forEach(item => {
        dateTotals[item.time] =
            (dateTotals[item.time] || 0) + Number(item.amount);
    });

    const dateLabels = Object.keys(dateTotals);
    const dateValues = Object.values(dateTotals);

    // Destroy old charts
    pieChart?.destroy();
    barChart?.destroy();
    lineChart?.destroy();

    // ---------- PIE ----------
    pieChart = new Chart(pieCtx, {
        type: "doughnut",
        data: {
            labels: catLabels,
            datasets: [{
                data: catValues,
                backgroundColor: [
                    "#6366f1", "#3b82f6", "#22c55e",
                    "#f59e0b", "#ec4899", "#ef4444"
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: "65%",
            layout: {
                padding: { top: 20, bottom: 25 }
            },
            plugins: {
                legend: {
                    position: "bottom",
                    labels: {
                        padding: 18,   // ✅ main fix
                        boxWidth: 12,
                        font: { size: 11, weight: "500" },
                        color: "#e5e7eb"
                    }
                }
            }
        }

    });

    // ---------- BAR ----------
    barChart = new Chart(barCtx, {
        type: "bar",
        data: {
            labels: catLabels,
            datasets: [{
                label: "Expenses (₹)",
                data: catValues,
                backgroundColor: "#3b82f6",
                borderRadius: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: {
                    ticks: {
                        padding: 10,
                        color: "#9ca3af",
                        font: { size: 11 }
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        padding: 10,
                        color: "#9ca3af",
                        font: { size: 11 }
                    },
                    grid: {
                        color: "rgba(255,255,255,0.05)"
                    }
                }
            }

        }
    });

    // ---------- LINE ----------
    lineChart = new Chart(lineCtx, {
        type: "line",
        data: {
            labels: dateLabels,
            datasets: [{
                label: "Daily Spend (₹)",
                data: dateValues,
                borderColor: "#22c55e",
                backgroundColor: "rgba(34,197,94,.15)",
                fill: true,
                tension: 0.4,
                pointRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: { color: "#d1d5db" } }
            },
            scales: {
                x: {
                    ticks: {
                        padding: 10,
                        color: "#9ca3af",
                        font: { size: 11 }
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        padding: 10,
                        color: "#9ca3af",
                        font: { size: 11 }
                    },
                    grid: {
                        color: "rgba(255,255,255,0.05)"
                    }
                }
            }

        }
    });
}




const username = localStorage.getItem("ExpenseUsername")
document.querySelector(".username").innerHTML = username;

async function loadtasks() {
    try {
        const token = localStorage.getItem("token2");
        const data = await fetch("/getexpense", {
            headers: {
                "Authorization": token
            }
        })
        if (data.status === 401) {  // token expired ya invalid
            localStorage.removeItem("token2");  // purana token remove karo
            window.location.href = "/login.html";  // login page pe redirect
            return;
        }

        const newdata = await data.json()
        kharcha = newdata //newdata will be array of objects
        updateSummary();   // ✅ HERE
        updateCharts(); // ⬅ UPDATE CHART AFTER LOADING
        render()
    } catch (err) {
        console.log(err)
    }
}

function render() {
    document.querySelector(".ExpenseCont").innerHTML = ""
    kharcha.forEach((a) => {

        document.querySelector(".ExpenseCont").innerHTML += `<div
                        class="Expensebox text-white px-3 py-2 border rounded-xl m-2.5 border-[#2a2a2a]" data-id=${a.date} style=" display: grid; grid-template-columns: 1fr 1fr 1fr 1fr 1fr; align-content:center;height: 14%;">

                        <div class="title-btn">${a.title}</div>
                        <div class="time-btn text-center">${a.time}</div>
                        <div class="text-center category-btn">${a.category}</div>
                        <div class="text-center amount-btn">${a.amount}</div>

                        <!-- Delete Icon -->
                        <div class="flex justify-end">
                            <span class="material-symbols-outlined cursor-pointer delete-btn
hover:text-red-400
active:text-red-400 active:scale-[0.9]
focus:text-red-400
transition-all duration-200">
    delete
</span>

                        </div>

                    </div>`
    })
    document.getElementById("titleInput").value = ""
    document.getElementById("categoryInput").value = ""
    document.getElementById("priceInput").value = ""
    document.getElementById("dateInput").value = ""
    document.querySelector(".form").classList.add("hidden");
}

document.querySelectorAll(".hamburger").forEach((item) => {
    console.log("hii")
    item.addEventListener("click", () => {
        document.querySelector(".first").style.left = "0%"
        document.querySelector(".first").style.backgroundColor = "#222222"
    })
})


document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".first").style.left = "-130%"
})

document.querySelector(".addexpense").addEventListener("click", () => {
    document.querySelector(".form").classList.remove("hidden");
})
document.getElementById("cancelExpense").addEventListener("click", () => {
    document.querySelector(".form").classList.add("hidden");
})
document.getElementById("submitExpense").addEventListener("click", async () => {
    const title = document.getElementById("titleInput").value
    const category = document.getElementById("categoryInput").value
    const amount = document.getElementById("priceInput").value
    const rawDate = document.getElementById("dateInput").value;
    const samay = formatDate(rawDate); // DD-MM-YYYY
    console.log(samay)
    if (title === "" || category === "" || amount === "" || samay === "") {
        alert("Please fill all entries to submit");
        return;
    }
    const token = localStorage.getItem("token2")
    const data = await fetch("/create", { method: "POST", headers: { "Content-Type": "application/json", "Authorization": token }, body: JSON.stringify({ title, category, amount, time: samay, date: Date.now() }) })
    const newdata = await data.json()
    if (newdata.success) {
        kharcha.push(newdata.expense)
        updateSummary();   // ✅ HERE
        updateCharts(); // ⬅ UPDATE CHART AFTER LOADING
        render()
    }
    else {
        alert(newdata.message)
    }
})

document.querySelector(".logout").addEventListener("click", () => {
    localStorage.removeItem("token2")
    localStorage.removeItem("ExpenseUsername")
    window.location.href = "/login.html"
})

document.querySelector(".ExpenseCont").addEventListener("click", async (e) => {
    if (!e.target.classList.contains("delete-btn"))
        return;
    const token = localStorage.getItem("token2");
    try {
        const a = e.target.closest(".Expensebox")
        const date = a.dataset.id
        const res = await fetch("/delete", { method: "DELETE", headers: { "Content-Type": "application/json", "Authorization": token }, body: JSON.stringify({ date: date }) })
        if (res.status === 401) {  // token expired ya invalid
            localStorage.removeItem("token");  // purana token remove karo
            window.location.href = "/login.html";  // login page pe redirect
            return;
        }
        const newdata = await res.json()
        kharcha = newdata;
        updateSummary();   // ✅ HERE
        updateCharts(); // ⬅ UPDATE CHART AFTER LOADING
        render()
    } catch (err) {
        console.log(err)
    }
})

document.querySelector(".ExpenseCont").addEventListener("dblclick", async (e) => {
    if (!e.target.classList.contains("title-btn"))
        return;
    const token = localStorage.getItem("token2");
    try {
        const a = e.target.closest(".Expensebox")
        const date = a.dataset.id;
        const index = kharcha.findIndex(b => b.date == date)
        const newText = prompt("Enter new text", kharcha[index].title)
      if (!newText || newText.trim() === "") return;
            const data = await fetch("/update", {
                method: "PUT",
                headers: { "Content-Type": "application/json", "Authorization": token },
                body: JSON.stringify({ date: date, naya: newText })
            })
            if (data.status === 401) {  // token expired ya invalid
                localStorage.removeItem("token2");  // purana token remove karo
                window.location.href = "/login.html";  // login page pe redirect
                return;
            }
            const newdata = await data.json();
            kharcha[index] = newdata;
            updateSummary();   // ✅ HERE
            updateCharts(); // ⬅ UPDATE CHART AFTER LOADING
            render()
        
    } catch (err) {
        console.log(err)
    }
})
document.querySelector(".ExpenseCont").addEventListener("dblclick", async (e) => {
    if (!e.target.classList.contains("category-btn"))
        return;
    const token = localStorage.getItem("token2");
    try {
        const a = e.target.closest(".Expensebox")
        const date = a.dataset.id;
        const index = kharcha.findIndex(b => b.date == date)
        const newText = prompt("Enter new text", kharcha[index].category)
        if (!newText || newText.trim() === "") return;
            const data = await fetch("/update2", {
                method: "PUT",
                headers: { "Content-Type": "application/json", "Authorization": token },
                body: JSON.stringify({ date: date, naya: newText })
            })
            if (data.status === 401) {  // token expired ya invalid
                localStorage.removeItem("token2");  // purana token remove karo
                window.location.href = "/login.html";  // login page pe redirect
                return;
            }
            const newdata = await data.json();
            kharcha[index] = newdata;
            updateSummary();   // ✅ HERE
            updateCharts(); // ⬅ UPDATE CHART AFTER LOADING
            render()
        
    } catch (err) {
        console.log(err)
    }
})
document.querySelector(".ExpenseCont").addEventListener("dblclick", async (e) => {
    if (!e.target.classList.contains("amount-btn"))
        return;
    const token = localStorage.getItem("token2");
    try {
        const a = e.target.closest(".Expensebox")
        const date = a.dataset.id;
        const index = kharcha.findIndex(b => b.date == date)
        const newText = prompt("Enter new text", kharcha[index].amount)
        if (!newText || newText.trim() === "") return;
            const data = await fetch("/update3", {
                method: "PUT",
                headers: { "Content-Type": "application/json", "Authorization": token },
                body: JSON.stringify({ date: date, naya: newText })
            })
            if (data.status === 401) {  // token expired ya invalid
                localStorage.removeItem("token2");  // purana token remove karo
                window.location.href = "/login.html";  // login page pe redirect
                return;
            }
            const newdata = await data.json();
            kharcha[index] = newdata;
            updateSummary();   // ✅ HERE
            updateCharts(); // ⬅ UPDATE CHART AFTER LOADING
            render()
        
    } catch (err) {
        console.log(err)
    }
})
document.querySelector(".ExpenseCont").addEventListener("dblclick", async (e) => {
    if (!e.target.classList.contains("time-btn"))
        return;
    const token = localStorage.getItem("token2");
    try {
        const a = e.target.closest(".Expensebox")
        const date = a.dataset.id;
        const index = kharcha.findIndex(b => b.date == date)
        const newText = prompt("Enter new text", kharcha[index].time)
        if (!newText || newText.trim() === "") return;
            const data = await fetch("/update4", {
                method: "PUT",
                headers: { "Content-Type": "application/json", "Authorization": token },
                body: JSON.stringify({ date: date, naya: newText })
            })
            if (data.status === 401) {  // token expired ya invalid
                localStorage.removeItem("token2");  // purana token remove karo
                window.location.href = "/login.html";  // login page pe redirect
                return;
            }
            const newdata = await data.json();
            kharcha[index] = newdata;
            updateSummary();   // ✅ HERE
            updateCharts(); // ⬅ UPDATE CHART AFTER LOADING
            render()
        
    } catch (err) {
        console.log(err)
    }
})

document.querySelector(".expense-show").addEventListener("click", () => {
    document.querySelector(".expensepage").classList.remove("hidden")
    document.getElementById("homePage").classList.add("hidden")
})
document.querySelector(".home-show").addEventListener("click", () => {
    document.querySelector(".expensepage").classList.add("hidden")
    document.getElementById("homePage").classList.remove("hidden")
})

document.querySelector(".travel").addEventListener("click", () => {
    alert("🚧 This feature is under development and will be available soon.");
})
document.querySelector(".setting").addEventListener("click", () => {
    alert("🚧 This feature is under development and will be available soon.");
})

loadtasks()