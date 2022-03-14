const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const url = require("url");
const {json} = require("express");

const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function (request, response)
{
    response.sendFile(__dirname + "/index.html");
});

app.post("/", function (req,res)
{
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address : email,
                status : "subscribed",
                merge_fields : {
                    FNAME : firstName,
                    LNAME : lastName
                }
            }
        ]
    };

    const JSONData = JSON.stringify(data);
    const url = "https://us20.api.mailchimp.com/3.0/lists/aabc5d2eb6";

    const options = {
        method : "POST",
        auth : "itsadityap:6a83d7b6939da92798687eda56fd4c9a-us20"
    }

    const request = https.request(url, options, function (response)
    {
        if(response.statusCode === 200)
        {
            res.sendFile(__dirname+ "/success.html");
        }
        else
        {
            res.sendFile(__dirname+ "/failure.html");
        }

        response.on("data", function (data){
            console.log(JSON.parse(data));
        })
    })

    request.write(JSONData);
    request.end();
});

app.post("/failure", function (req,res)
{
   res.redirect("/");
});

app.listen(process.env.PORT || 3000, function ()
{
   console.log("Server is running on the port.");
});