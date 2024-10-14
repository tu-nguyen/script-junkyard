function getUtilInfo(utils) {

  // get the most recent bill emails 
  recentBills = getRecentBillEmails();

  // single out by utils
  billEmails = getBillFromSender(recentBills);

  res = {}
  for (const key of utils) {

    // get amount and due date
    if (["NationalGridGas", "NationalGridElectric"].includes(key)) {
      // NationalGrid sends in the same email thread, parseEmail will handle sep logic
      billDetails = parseEmail(key, billEmails["NationalGrid"]);
    } else {
      billDetails = parseEmail(key, billEmails[key]);
    }

    if (!(billDetails)) {
      continue
    }
    
    res[key] = {
      "amount": billDetails.amount,
      "dueDate": billDetails.dueDate,
      };
  }

  return res;
}

function getRecentBillEmails() {
  var label = GmailApp.getUserLabelByName("money/bills/utils");
  var threads = label.getThreads();

  var res = []
  for (var i = 0; i <= 6; i++) {
    var subject = threads[i].getFirstMessageSubject();
    var messages = threads[i].getMessages();
    var sender = messages[0].getFrom();

    res[i] = {
      "sender": sender,
      "subject": subject,
      "messages": messages,
      }
  }

  return res;
}

function getBillFromSender(billEmails) {
  var senderMapping = {
    "Verizon": "Verizon Notification <verizon-notification@ecrm-mail.verizon.com>",
    "Xfinity": "Xfinity <online.communications@alerts.comcast.net>",
    "NationalGrid": "National Grid <nationalgrid@emails.nationalgridus.com>",
  }
  senderVisit = []

  var res = {}
  for (var i = 0; i < billEmails.length; i++) {
    curr_sender = billEmails[i].sender

    for (const [key, value] of Object.entries(senderMapping)) {
      if (curr_sender == value && senderVisit.indexOf(key) < 0) {
        senderVisit.push(key)
        res[key] = billEmails[i]
      } 
    }
  }

  return res
}

function parseEmail(key, email) {
  var searchDetailMapping = {
    "Verizon": {
      "row": 5,
      "amount_regex_pattern": /\$\S+/g,
      "due_date_regex_pattern": /(January|Febuary|March|April|May|June|July|August|September|October|November|December) \d{1,2}, \d{2,4}/,
      },
    "Xfinity": {
      "row": 4,
      "amount_regex_pattern": /\$\S+/g,
      "due_date_regex_pattern": /\d{1,2}\/\d{1,2}\/\d{2,4}/,
      },
    "NationalGrid": {
      "amount_regex_pattern": /<span[^>]*>(\d+\.?\d*)<\/span>/g,
      "due_date_regex_pattern": /<span[^>]*>\s*(\d{2}\/\d{2}\/\d{4})\s*<\/span>/,
    }
  }

  if (["Verizon", "Xfinity"].includes(key))  {
    var htmlBody = email.messages[0].getBody()
    var amount = htmlBody.match(searchDetailMapping[key].amount_regex_pattern)[0].replace(/[^\d\.]/g,'')
    var dueDate = htmlBody.match(searchDetailMapping[key].due_date_regex_pattern)[0].replace(/ +/, "/").replace(", ", "/")  // TODO: figure out regex for both later

    var month_str = dueDate.match(/(January|Febuary|March|April|May|June|July|August|September|October|November|December)/)

    if (!(month_str === null)) {
      dueDate = dueDate.replace(month_str[0], parseMonth(month_str))
    }

    return { "amount": amount, "dueDate": dueDate }
  } else if (["NationalGridGas", "NationalGridElectric"].includes(key)) {
    if (key == "NationalGridGas") {
      htmlSearch = "Gas"
    } else if  (key == "NationalGridElectric") {
      htmlSearch = "Electricity"
    }

    var htmlBody = ""
    for (var i = 0; i < email.messages.length; i++) {
      var tempBody = email.messages[i].getBody()

      if (tempBody.includes(htmlSearch)) {
        htmlBody = tempBody
      } 
    }

    var amountArray = htmlBody.match(searchDetailMapping["NationalGrid"].amount_regex_pattern)
    if (!(amountArray)) {
      return 
    }
    var amount = getAmountFromNationalGrid(amountArray)
    var dueDate = htmlBody.match(searchDetailMapping["NationalGrid"].due_date_regex_pattern)[1]

    return { "amount": amount, "dueDate": dueDate }
  }
}

function getAmountFromNationalGrid(amountArray) {
  var regex = /<span[^>]*>(\d+\.?\d*)<\/span>/g;
  var concatenatedResult = '';

  // Loop through each HTML string in the array
  amountArray.forEach(function(htmlString) {
    var match;
    // Extract numbers from the current HTML string
    while ((match = regex.exec(htmlString)) !== null) {
      concatenatedResult += match[1]; // Append the extracted number
    }
  });

  return concatenatedResult;
}

function parseMonth(string) {
  if (string.includes("Jan") || string.includes("January")) {
    return "01"
  } else if (string.includes("Feb") || string.includes("January")) {
    return "02"
  } else if (string.includes("Mar") || string.includes("March")) {
    return "03"
  } else if (string.includes("Apr") || string.includes("April")) {
    return "04"
  } else if (string.includes("May")) {
    return "05"
  } else if (string.includes("Jun") || string.includes("June")) {
    return "06"
  } else if (string.includes("Jul") || string.includes("July")) {
    return "07"
  } else if (string.includes("Aug") || string.includes("August")) {
    return "08"
  } else if (string.includes("Sep") || string.includes("September")) {
    return "09"
  } else if (string.includes("Oct") || string.includes("October")) {
    return "10"
  } else if (string.includes("Nov") || string.includes("November")) {
    return "11"
  } else if (string.includes("Dec") || string.includes("December")) {
    return "12"
  } else {
    return 0
  }
}
