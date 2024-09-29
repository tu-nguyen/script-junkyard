function UpdateBudgetSheet() {
  var utils = [
    "Xfinity",
    "Verizon",
    "NationalGridGas",
    "NationalGridElectric",
  ]

  var utilRowMapping = {
      "Xfinity": 4,
      "Verizon": 5,
      "NationalGridGas": 3,
      "NationalGridElectric": 2,
      }

  var budget_spread_sheet = SpreadsheetApp.getActiveSpreadsheet();
  var util_sheet = budget_spread_sheet.getSheetByName("utils");

  // getUtilInfo -> returns name, amount, due date
  utilInfo = getUtilInfo(utils);

  for (const [key, value] of Object.entries(utilInfo)) {
    util_sheet.getRange("B" + utilRowMapping[key]).setValue(value["amount"]);
    util_sheet.getRange("C" + utilRowMapping[key]).setValue(value["dueDate"]);
  }
}