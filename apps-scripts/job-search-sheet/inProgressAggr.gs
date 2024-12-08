function inProgressUpdate() {
  // init common color labels
  const BLANK = "#ffffff"
  const BLACK = "#000000"
  // reds
  const RED = "#ff0000"
  const LIGHTRED3 = "#f4cccc"
  const LIGHTRED2 = "#ea9999"
  //blues
  const BLUE = "#4a86e8"
  const LIGHTBLUE3 = "#c9daf8"
  const LIGHTBLUE2 = "#a4c2f4"
  // green(s?)
  const GREEN = "#d9ead3"

  var spreadsheet = SpreadsheetApp.getActive().getSheetByName("resume submissions");
  var Avals = spreadsheet.getRange("A3:A").getValues();
  var Alast = Avals.filter(String).length;
  // + 2 for header, and first entry which is previous/current job
  var lastRow = Alast + 2

  var red_count = 0;
  var blue_count = 0;
  var blank_count = 0;
  var green_count = 0;
  var unknown_count = 0;

  var blues = [];
  var greens = [];
  // start 4
  for (var row = 456; row <= lastRow; row++) {
    cell = spreadsheet.getRange("A" + row).activate();
    currentColor = cell.getBackground();

    if (currentColor == BLACK) {
      console.log("BLACK color label found at " + row)
    }
    
    if (currentColor == BLANK) {
      blank_count += 1;
    } else if (currentColor == RED || currentColor == LIGHTRED3 || currentColor == LIGHTRED2 ) {
      red_count += 1;
    } else if (currentColor == BLUE || currentColor == LIGHTBLUE3 || currentColor == LIGHTBLUE2 ) {
      blues.push(pullAppRow(spreadsheet, row))
      blue_count += 1;
    } else if (currentColor == GREEN) {
      greens.push(pullAppRow(spreadsheet, row))
      green_count += 1;
    } else {
      console.log("Unknown color label found at " + row)
      unknown_count += 1;
    }    
  }

  // Update "count" sheet
  spreadsheet = SpreadsheetApp.getActive().getSheetByName("count");
  spreadsheet.getRange("C14").activate().setValue(blank_count);
  spreadsheet.getRange("E14").activate().setValue(red_count);
  spreadsheet.getRange("G14").activate().setValue(blue_count);
  spreadsheet.getRange("I14").activate().setValue(green_count);

  spreadsheet.getRange("A18:I42").clear();
  var inProgress_row = 18;
  inProgress_row = addAppRows(spreadsheet, inProgress_row, blues);
  inProgress_row = addAppRows(spreadsheet, inProgress_row, greens, bgColor=GREEN);
}


function pullAppRow(spreadsheet, row) {
  role = spreadsheet.getRange("A" + row).activate().getValue();
  company = spreadsheet.getRange("B" + row).activate().getValue();
  note = spreadsheet.getRange("M" + row).activate().getValue();
  salary_listed = spreadsheet.getRange("N" + row).activate().getValue();
  salary_given = spreadsheet.getRange("O" + row).activate().getValue();
  hiring_steps = spreadsheet.getRange("P" + row).activate().getValue();
  date_submitted = spreadsheet.getRange("H" + row).activate().getValue();

  return {
    "role": role,
    "company": company,
    "note": note,
    "salary_listed": salary_listed, 
    "salary_given": salary_given, 
    "hiring_steps": hiring_steps, 
    "date_submitted": date_submitted,
  }
}


function addAppRows(spreadsheet, row, appArr, bgColor=null) {
  for (i=0; i < appArr.length; i++) {
    // role
    spreadsheet.getRange("A" + row).activate().setValue(appArr[i]["role"]);
    // company
    spreadsheet.getRange("B" + row).activate().setValue(appArr[i]["company"]);
    // note
    spreadsheet.getRange("C" + row).activate().setValue(appArr[i]["note"]);
    // salary_listed
    spreadsheet.getRange("D" + row).activate().setValue(appArr[i]["salary_listed"]);
    // salary_given
    spreadsheet.getRange("E" + row).activate().setValue(appArr[i]["salary_given"]);
    // hiring_steps
    spreadsheet.getRange("F" + row).activate().setValue(appArr[i]["hiring_steps"]);
    // date_submitted
    spreadsheet.getRange("G" + row).activate().setValue(appArr[i]["date_submitted"]);

    if (bgColor) {
      cell = spreadsheet.getRange("A" + row + ":" + "G" + row).setBackground(bgColor);
    }

    row += 1;
  }

  return row
}