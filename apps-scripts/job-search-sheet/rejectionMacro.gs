/** @OnlyCurrentDoc */

function JobRejection() {
  const RED = "#f4cccc";
  var spreadsheet = SpreadsheetApp.getActive();
  var row = spreadsheet.getActiveCell().getRow();

  spreadsheet.getRange(row + ":" + row).activate();
  spreadsheet.getActiveRangeList().setBackground(RED);

  var cell = spreadsheet.getRange("M" + row).activate();
  var currentDate = new Date();
  var currentDateString = (currentDate.getMonth() + 1).toString().padStart(2, "0") + "/" + currentDate.getDate().toString().padStart(2, "0") + "/" + currentDate.getFullYear();
  var rejectionValue = "(" + currentDateString + ") rejection email";

  var currentValue = cell.getValue();
  var value = "";
  if (currentValue) {
    var lines = currentValue.split("\n")
    for (var i = 0; i < lines.length; i++) {
      if (lines[i].trim() == "(?)" || lines[i].trim() == "()") {
        lines.splice(i, 1);
        i--
      } 
    }

    currentValue = lines.join("\n");

    value = currentValue + "\n" + rejectionValue;
  } else {
    value = rejectionValue;
  }

  cell.setValue(value);
};