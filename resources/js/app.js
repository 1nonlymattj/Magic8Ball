(function () {
  const $ = (sel) => {
    const el = document.querySelector(sel);
    if (!el) throw new Error(`Missing element: ${sel}`);
    return el;
  };

  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function nowId() {
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function shake(el) {
    if (!el) return;
    el.classList.remove("shake");
    void el.offsetWidth; // reflow to restart animation
    el.classList.add("shake");
  }

  function downloadJson(filename, dataObj) {
    const json = JSON.stringify(dataObj, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function exportToCSV(filename, rows) {
    if (!rows.length) return;

    const header = ["Timestamp", "Question", "Answer"];
    const csvContent = [
      header,
      ...rows.map((item) => [
        new Date(item.ts).toLocaleString(),
        item.question,
        item.answer
      ])
    ]
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function safeDateStamp() {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(
      d.getHours()
    )}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
  }

  window.addEventListener("DOMContentLoaded", () => {
    let dashboardUnlocked = false;
    const els = {
      eightBall: $(window.SELECTORS.eightBall),
      eightBallInner: $(window.SELECTORS.eightBallInner),
      triangle: $(window.SELECTORS.triangle),
      eightBallNumber: $(window.SELECTORS.eightBallNumber),
      eightBallAnswer: $(window.SELECTORS.eightBallAnswer),

      askQuestion: $(window.SELECTORS.askQuestion),
      questionButton: $(window.SELECTORS.questionButton),
      resetButton: $(window.SELECTORS.resetButton),

      dashboardBtn: $(window.SELECTORS.dashboardBtn),
      dashboardPanel: $(window.SELECTORS.dashboardPanel),

      pinModal: $(window.SELECTORS.pinModal),
      pinInput: $(window.SELECTORS.pinInput),
      pinSubmit: $(window.SELECTORS.pinSubmit),
      pinCancel: $(window.SELECTORS.pinCancel),
      pinError: $(window.SELECTORS.pinError),

      historyToggle: $(window.SELECTORS.historyToggle),
      historyPanel: $(window.SELECTORS.historyPanel),
      historyList: $(window.SELECTORS.historyList),
      historyEmpty: $(window.SELECTORS.historyEmpty),
      historyClear: $(window.SELECTORS.historyClear),

      exportJson: $(window.SELECTORS.exportJson),
      exportCsv: $(window.SELECTORS.exportCsv),

      themeBtn: $(window.SELECTORS.themeBtn),

      // optional native dialog elements if you still have them
      alertDialog: document.querySelector(window.SELECTORS.alertDialog),
      alertTitle: document.querySelector(window.SELECTORS.alertTitle),
      alertMessage: document.querySelector(window.SELECTORS.alertMessage)
    };
    const THEME_KEY = "magic8ball-theme";

    function showAlert(title, message) {
      if (els.alertDialog && typeof els.alertDialog.showModal === "function") {
        els.alertTitle.textContent = title;
        els.alertMessage.textContent = message;
        els.alertDialog.showModal();
      } else {
        alert(`${title}\n\n${message}`);
      }
    }

    function setBallInitial() {
      els.eightBallAnswer.textContent = "";
      els.eightBallNumber.textContent = "8";
      els.triangle.classList.add("hidden");
      els.eightBallInner.classList.remove("innerFinish");
      els.eightBallInner.classList.add("innerInitial");
      els.eightBall.classList.remove("shake");
    }

    function setBallAnswer(answer) {
      els.eightBallNumber.textContent = "";
      els.triangle.classList.remove("hidden");
      els.eightBallInner.classList.remove("innerInitial");
      els.eightBallInner.classList.add("innerFinish");
      els.eightBallAnswer.textContent = answer;
    }

    function isBallNotInitial() {
      return (
        els.eightBallNumber.textContent !== "8" ||
        (els.eightBallAnswer.textContent || "").trim() !== ""
      );
    }

    function renderHistory() {
      const items = window.HistoryStore.listNewest(window.UI.maxHistoryItemsShown);
      els.historyList.innerHTML = "";

      if (!items.length) {
        els.historyEmpty.classList.remove("hidden");
        return;
      }
      els.historyEmpty.classList.add("hidden");

      items.forEach((item) => {
        const li = document.createElement("li");
        li.className = "historyItem";
        li.innerHTML = `
          <div><strong>Q:</strong> ${item.question}</div>
          <div><strong>A:</strong> ${item.answer}</div>
          <div style="font-size:12px;color:#666">${new Date(item.ts).toLocaleString()}</div>
        `;
        els.historyList.appendChild(li);
      });
    }

    function applyTheme(theme) {
        const isDark = theme === "dark";
        document.body.classList.toggle("dark", isDark);
        els.themeBtn.textContent = isDark ? "☀️" : "🌙";
    }

    function toggleTheme() {
        const isDark = document.body.classList.contains("dark");
        const next = isDark ? "light" : "dark";
        localStorage.setItem(THEME_KEY, next);
        applyTheme(next);
    }

    // Load saved theme on startup
    applyTheme(localStorage.getItem(THEME_KEY) || "light");

    els.themeBtn.addEventListener("click", toggleTheme);

    function resetAll() {
      els.askQuestion.value = "";
      setBallInitial();
    }

    function lockDashboard() {
      dashboardUnlocked = false;
      els.dashboardPanel.classList.add("hidden");
      els.historyPanel.classList.add("hidden");
      els.historyToggle.textContent = "History";
    }

    function unlockDashboard() {
      dashboardUnlocked = true;
      els.dashboardPanel.classList.remove("hidden");
    }

    function openPinModal() {
      els.pinError.classList.add("hidden");
      els.pinInput.value = "";
      els.pinSubmit.textContent = dashboardUnlocked ? "Lock" : "Unlock";
      els.pinModal.classList.remove("hidden");
      // focus input after opening
      setTimeout(() => els.pinInput.focus(), 0);
    }

    function closePinModal() {
      // move focus OUT of modal before hiding it (prevents aria warning)
      els.dashboardBtn.focus();
      els.pinModal.classList.add("hidden");
    }

    function ask() {
      const question = els.askQuestion.value.trim();
      if (!question) {
        showAlert("No Question Entered", "Please enter a question.");
        return;
      }

      shake(els.eightBall);
      const answer = pickRandom(window.ANSWERS);

      setTimeout(() => {
        setBallAnswer(answer);

        window.HistoryStore.add({
          id: nowId(),
          ts: Date.now(),
          question,
          answer
        });

        // clear input after asking
        els.askQuestion.value = "";

        if (!els.historyPanel.classList.contains("hidden")) {
          renderHistory();
        }
      }, window.UI.revealDelayMs);
    }

    // --- Events: main ---
    els.questionButton.addEventListener("click", ask);
    els.resetButton.addEventListener("click", resetAll);

    els.askQuestion.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        ask();
      }
    });

    // Click/focus input clears it + resets ball if needed
    els.askQuestion.addEventListener("focus", () => {
      els.askQuestion.value = "";
      if (isBallNotInitial()) setBallInitial();
    });
    els.askQuestion.addEventListener("click", () => {
      els.askQuestion.value = "";
    });

    // --- Events: dashboard/pin ---
    els.dashboardBtn.addEventListener("click", openPinModal);
    els.pinCancel.addEventListener("click", closePinModal);

    els.pinSubmit.addEventListener("click", () => {
        const pin = els.pinInput.value.trim();

        if (pin !== window.DASH_PIN) {
            els.pinError.classList.remove("hidden");
            els.pinInput.value = "";
            els.pinInput.focus();
            return;
        }

        // Correct PIN: toggle state
        if (dashboardUnlocked) {
            lockDashboard();
        } else {
            unlockDashboard();
        }

        closePinModal();
    });

    els.pinInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") els.pinSubmit.click();
      if (e.key === "Escape") closePinModal();
    });

    // --- Events: history/export (dashboard-only UI but listeners are fine) ---
    els.historyToggle.addEventListener("click", () => {
      els.historyPanel.classList.toggle("hidden");
      if (!els.historyPanel.classList.contains("hidden")) {
        renderHistory();
        els.historyToggle.textContent = "Hide History";
      } else {
        els.historyToggle.textContent = "History";
      }
    });

    els.historyClear.addEventListener("click", () => {
      window.HistoryStore.clear();
      els.historyPanel.classList.add("hidden");
      els.historyToggle.textContent = "History";
    });

    els.exportJson.addEventListener("click", () => {
      const items = window.HistoryStore.exportAll();
      if (!items.length) {
        showAlert("Nothing to Export", "History is empty.");
        return;
      }
      downloadJson(`magic8ball-history_${safeDateStamp()}.json`, {
        exportedAt: new Date().toISOString(),
        count: items.length,
        history: items
      });
    });

    els.exportCsv.addEventListener("click", () => {
      const items = window.HistoryStore.exportAll();
      if (!items.length) {
        showAlert("Nothing to Export", "History is empty.");
        return;
      }
      exportToCSV(`magic8ball-history_${safeDateStamp()}.csv`, items);
    });

    // --- initial state ---
    lockDashboard();   // ✅ ensures dashboard tools are hidden on load
    setBallInitial();  // ✅ ensures ball starts at 8
  });
})();