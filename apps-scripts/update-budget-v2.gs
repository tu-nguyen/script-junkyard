function UpdateBudgetSheet() {
  var budget_spread_sheet = SpreadsheetApp.getActiveSpreadsheet();

  let utils = [
    {
      "row": 5,
      "bill": "Verizon",
      "amountIndex": "*Total amount due:*",
      "amountStart": 21,
      "DueIndex": "*Your payment date (via Auto Pay):*",
      "DueStart": 31,
      "DueEnd": "\n",
      "DueOffset": 0,
      "DueDay": "15",
      "is_parsed": false
    },
    {
      "row": 4,
      "bill": "Xfinity",
      "amountIndex": "",
      "amountStart": 0,
      "DueIndex": "",
      "DueStart": 0,
      "DueEnd": "",
      "DueOffset": 0,
      "DueDay": "15",
      "is_parsed": false
    },
    {
      "row": 3,
      "bill": "NationalGridGas",
      "amountIndex": "$ ",
      "amountStart": 0,
      "DueIndex": "Due Date: ",
      "DueStart": 0,
      "DueEnd": "\n",
      "DueOffset": 0,
      "DueDay": "15",
      "is_parsed": false
    },
    {
      "row": 2,
      "bill": "NationalGridElectric",
      "amountIndex": "$ ",
      "amountStart": 0,
      "DueIndex": "Due Date: ",
      "DueStart": 10,
      "DueEnd": "\n",
      "DueOffset": 0,
      "DueDay": "15",
      "is_parsed": false
    }
  ]

  parseUtilEmail(budget_spread_sheet, utils);
}

function parseUtilEmail(budget_spread_sheet, utils) {
  var util_sheet = budget_spread_sheet.getSheetByName("utils");
  var label = GmailApp.getUserLabelByName("money/bills/utils");
  var threads = label.getThreads();
  for (var i = 0; i < utils.length; i++) {
    var subject = threads[i].getFirstMessageSubject();
    var message = threads[i].getMessages();
    for (var j = 0; j < message.length; j++) {
      var sender = message[j].getFrom();
      var pmsg = message[j].getPlainBody();
      var date = message[j].getDate();

      row = sender.includes("Verizon ") ? "5" : sender.includes("Xfinity ") ? "4" : subject.includes("gas") ? "3" : "2";
      let util = utils.find(util => util.row == row);

      if (util.is_parsed == false) {
        parseUtil(util, pmsg, date, util_sheet);
      }
    }
  }
}

function parseUtil(util, pmsg, date, util_sheet) {
  due_month = date.getMonth()
  if (util.row == 5 || util.row == 3 || util.row == 2) {
    var util_amount_last = pmsg.substring(pmsg.indexOf(util.amountIndex), pmsg.length);
    var util_amount = util_amount_last.substring(util.amountStart, util_amount_last.indexOf("\n")).replace("+", "").replace("\n*", "").replace(/\s/g, "") ;
    util_sheet.getRange("B" + util.row).setValue(util_amount);

    if (util.row == 5) {
      if (due_month >= 11) {
        due_month = due_month - 12
      } 
      util_due_date = String(due_month + 2) + "/" + util.DueDay + "/" + String(date.getFullYear());
      util_sheet.getRange("C" + util.row).setValue(util_due_date);
    } else {
      var util_due_date_last = pmsg.substring(pmsg.indexOf(util.DueIndex) + util.DueOffset, pmsg.length);
      var util_due_date = util_due_date_last.substring(util.DueStart, util_due_date_last.indexOf(util.DueEnd)).replace(".", "");

      if (parseMonth(util_due_date)) {
        // Weird case when it's "Due Date: By Dec 29" or some shit
        due_month = parseMonth(util_due_date)
        due_day = util_due_date_last.substring(17, util_due_date_last.indexOf(util.DueEnd) - 1).replace(".", "");
        util_due_date = String(due_month) + "/" + due_day + "/" + String(date.getFullYear());
      } 
      util_sheet.getRange("C" + util.row).setValue(util_due_date);
    }
  } else {
    // using timezones and JS is counting months from 0 <-- smfh yikes js
    // this is case for Comcast to hardcode due date
    util_due_date = String(due_month + 1) + "/" + util.DueDay + "/" + String(date.getFullYear());
    util_sheet.getRange("C" + util.row).setValue(util_due_date);
  }
  util.is_parsed = true;

  // Logger.log("testing parsing util..")
  // Logger.log("current util:" + util["bill"])
  // Logger.log("email sent: " + date)
  // Logger.log("util_amount:" + util_amount)
  // Logger.log("util_due_date:" + util_due_date)
  // Logger.log(" ")
}

function parseMonth(string) {
  if (string.includes("Jan") || string.includes("January")) {
    return 1
  } else if (string.includes("Feb") || string.includes("January")) {
    return 2
  } else if (string.includes("Mar") || string.includes("March")) {
    return 3
  } else if (string.includes("Apr") || string.includes("April")) {
    return 4
  } else if (string.includes("May")) {
    return 5
  } else if (string.includes("Jun") || string.includes("June")) {
    return 6
  } else if (string.includes("Jul") || string.includes("July")) {
    return 7
  } else if (string.includes("Aug") || string.includes("August")) {
    return 8
  } else if (string.includes("Sep") || string.includes("September")) {
    return 9
  } else if (string.includes("Oct") || string.includes("October")) {
    return 10
  } else if (string.includes("Nov") || string.includes("November")) {
    return 11
  } else if (string.includes("Dec") || string.includes("December")) {
    return 12
  } else {
    return 0
  }
}