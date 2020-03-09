const express = require("express")
const app = express()

// this is to get the data posted from html file
const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({
  extended: true
}))

const https = require("https")
const request = require("request")

// use the static method from express to access local file, because our css file is on our local
app.use(express.static("public"))

// Browser send GET request (app.get) of our home route to our server, our server send a RESPONSE (res)
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html")
})

app.post("/", function(req, res) {
  const firstName = req.body.firstName
  const lastName = req.body.lastName
  const email = req.body.email
  console.log(firstName)
  console.log(lastName)
  console.log(email)

  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merger_fields: {
        FNAME: firstName,
        LNAME: lastName,
      }
    }]
  };

  const jsonData = JSON.stringify(data) // this is what we are going to send to MailChimp

  // we use the callback function(response) to ask a response from MailChimp server.
  // in MailChimp Code examples, we can copy the url, we need to change the X to the last number in our API key and add /listid
  const url = "https://us19.api.mailchimp.com/3.0/cb9ed66b54"

  // in Node.js http_request_options_callback there are many options,, we will use method <string> A string specifying the HTTP request method. Default is "GET"

  // then we need to go to https://mailchimp.com/developer/guides/get-started-with-mailchimp-api-3/ and find Authentication methods, HTTP Basic Authentication, To authenticate a request using an API key, follow these steps.
  // Enter any string as the username.
  // Enter your API Key as the password.

  //https://nodejs.org/api/http.html#http_http_request_options_callback
  //auth <string> Basic authentication i.e. 'user:password' to compute an Authorization header.

  const options = {
    method: "POST",
    auth: "lutang123: e865c27be081207d05d6b879203c6cd4-us19"
  }

  // see this https://stackoverflow.com/questions/40537749/how-do-i-make-a-https-post-in-node-js-without-any-third-party-module
  // make the request as a constant
  const request = https.request(url, options, function(response) {

    // 1. find bootstrap jumbotron: https://getbootstrap.com/docs/4.0/components/jumbotron/
    // 2. copy and paste the div into  in the body of failure.html and success.html
    // 3. also copy and paste the bootstrap cdn into header in order to use bootstrap
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html")
    } else {
      res.sendFile(__dirname + "/failure.html")
    }

    response.on("data", function(data) {
      console.log(JSON.parse(data))
    })
  })

  request.write(jsonData)
  request.end()

})

app.post("/failure", function(req, res) {
  res.redirect("/")
})

// app.listen(3000, function() {
//   console.log("server is running on port 3000")
// })
app.listen(process.env.PORT || 3000, function() {
  console.log("server is running on Heroku and port 3000")
})


//
// API KEY
// e865c27be081207d05d6b879203c6cd4-us19

// audience list id
// cb9ed66b54
