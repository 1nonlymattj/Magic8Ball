window.SELECTORS = {
  // existing...
  eightBall: "#eightBall",
  eightBallInner: "#eightBallInner",
  triangle: "#triangle",
  eightBallNumber: "#eightBallNumber",
  eightBallAnswer: "#eightBallAnswer",
  askQuestion: "#askQuestion",
  questionButton: "#questionButton",
  resetButton: "#resetButton",

  // dashboard + history
  dashboardBtn: "#dashboardBtn",
  dashboardPanel: "#dashboardPanel",
  pinModal: "#pinModal",
  pinInput: "#pinInput",
  pinSubmit: "#pinSubmit",
  pinCancel: "#pinCancel",
  pinError: "#pinError",

  historyToggle: "#historyToggle",
  historyPanel: "#historyPanel",
  historyList: "#historyList",
  historyEmpty: "#historyEmpty",
  historyClear: "#historyClear",
  exportJson: "#exportJson",
  exportCsv: "#exportCsv",

  // dialog ids if you still use them
  alertDialog: "#alertDialog",
  alertTitle: "#alertTitle",
  alertMessage: "#alertMessage",

  // dark mode
  themeBtn: "#themeBtn"
};

window.UI = {
  revealDelayMs: 900,
  maxHistoryItemsShown: 25
};

// UI gate PIN (not real security in static apps)
window.DASH_PIN = "5609";

window.STORAGE = {
  key: "magic8ball-history-v1"
};