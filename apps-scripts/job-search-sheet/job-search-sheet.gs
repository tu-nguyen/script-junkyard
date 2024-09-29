/** @OnlyCurrentDoc */

function JobRejection() {
  var spreadsheet = SpreadsheetApp.getActive();
  var row = spreadsheet.getActiveCell().getRow();


  spreadsheet.getRange(row + ':' + row).activate();
  spreadsheet.getActiveRangeList().setBackground('#f4cccc');

  var cell = spreadsheet.getRange('M' + row).activate();
  var currentDate = new Date();
  var currentDateString = (currentDate.getMonth() + 1) + '/' + currentDate.getDate().toString().padStart(2, '0');
  var rejectionValue = '(' + currentDateString + ') rejection email';

  var currentValue = cell.getValue();
  var value = '';
  if (currentValue) {
    var lines = currentValue.split('\n')
    for (var i = 0; i < lines.length; i++) {
      if (lines[i] == '(?)') {
        lines.splice(i, 1);
        i--
      } 
    }

    currentValue = lines.join('\n');

    value = currentValue + '\n' + rejectionValue;
  } else {
    value = rejectionValue;
  }

  cell.setValue(value);
};