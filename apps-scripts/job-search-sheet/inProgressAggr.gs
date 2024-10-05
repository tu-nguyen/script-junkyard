function inProgressUpdate() {
  const BLANK = "#ffffff"

  const RED = "#ff0000"
  const LIGHTRED3 = "#f4cccc"
  const LIGHTRED2 = "#ea9999"

  const BLUE = "#4a86e8"
  const LIGHTBLUE3 = "#c9daf8"
  const LIGHTBLUE2 = "#a4c2f4"

  
  
  var spreadsheet = SpreadsheetApp.getActive().getSheetByName('resume submissions')

  var Avals = spreadsheet.getRange("A3:A").getValues();
  var Alast = Avals.filter(String).length;
  var lastRow = Alast + 2

  console.log(lastRow)

  var red_count = 0
  var blue_count = 0
  var blank_count = 0
  var unknown = 0

  var blues = []
  for (var row = 4; row < lastRow; row++) {
    cell = spreadsheet.getRange('A' + row).activate();
    currentColor = cell.getBackground();

    

    if (currentColor == RED || currentColor == LIGHTRED3 || currentColor == LIGHTRED2 ) {
      note = spreadsheet.getRange('M' + row).activate().getValue();

      if (note) {
        red_count += 1
      } else {
        blank_count += 1
      }
      
    } else if (currentColor == BLUE || currentColor == LIGHTBLUE3 || currentColor == LIGHTBLUE2 ) {
      role = cell.getValue();
      company = spreadsheet.getRange('B' + row).activate().getValue();
      note = spreadsheet.getRange('M' + row).activate().getValue();

      blue_count += 1
      blues.push([role, company, note])
    } else if (currentColor == BLANK) {
      blank_count += 1
    } else {
      unknown += 1
    }    
  }
  console.log(unknown)

  spreadsheet = SpreadsheetApp.getActive().getSheetByName('count')
  spreadsheet.getRange('F1').activate().setValue(blank_count);
  spreadsheet.getRange('F2').activate().setValue(red_count);
  spreadsheet.getRange('F3').activate().setValue(blue_count);

  spreadsheet.getRange('E6:G42').clear()

  inProgressRow = 6
  for (var i = 0; i < blues.length; i++) {
    spreadsheet.getRange('E' + inProgressRow).activate().setValue(blues[i][0])
    spreadsheet.getRange('F' + inProgressRow).activate().setValue(blues[i][1])
    spreadsheet.getRange('G' + inProgressRow).activate().setValue(blues[i][2])
    inProgressRow += 1
  }

  // console.log(reds);



}
