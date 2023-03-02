












const express = require('express')
const request = require('request')
const app = express()
const https = require('https')
const mailchimp = require("@mailchimp/mailchimp_marketing")
const listId = '4d03f2544d'

app.use(express.static(__dirname + '/public'))
app.use(express.urlencoded({ extended: true })) 

// Setting up MailChimp with details of admin

mailchimp.setConfig({
  // API KEY
  apiKey: "19be2ed708dcf30556adb00de8cedf07-us9",
  // API KEY PREFIX (THE SERVER)
  server: "us9"
})

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});   

app.post("/", function (req, res) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  // user data or data of members that you wish to
  // subscribe to the mailling list. THE DATA VARIABLE
  // AN ARRAY CONTAINING 2 ELEMENTs. INSIDE THIS 2 ELEMENTs
  // each containing 2 KEY VALUE PAIRES FOr THE EMAIL ADDRESS, THE 
  // STATUS AND  THE FNAME AND LNAME respectively.
  
// 2 objects (members and merge_fields)
  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName,
      }

    }]
  }

  // Converting string data to JSON data 
  const jsonData = JSON.stringify(data);
  const url = "https://us9.api.mailchimp.com/3.0/lists/" + listId
 
  // define options for the https request and authenticate
  const options = {
    method: "POST",
    auth: "Shad:19be2ed708dcf30556adb00de8cedf07-us9"
  }

  // On success send users to success, otherwise on failure template 
  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    // console log the data once it is parsed.
    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });

  //  use the 'request CONST' to send the jsonData which contains the details
  //  of the user in JSON format to mailchimp
  request.write(jsonData);
  request.end();
});

// Failure route: this redirects the user to the home
// route in a case where signup was unsuccessful.
app.post("/failure", function (req, res) {
  res.redirect("/");
})

app.listen(3000, () => {
  console.log('Server started at port 3000...');
})


