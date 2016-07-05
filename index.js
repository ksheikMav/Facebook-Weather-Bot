var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
var app = express()
// var http = require('http')
var requestify = require('requestify'); 

// var options = {
//     host: 'api.ipinfodb.com',
//     path: 'v3/ip-city/?key=57a270e806c9470043d95781a3fcef13a6b86fa75c05ffd6908308d0dd1e4143&ip=74.125.45.100&format=json'
// }


app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am a chat bot..Lets do this!')
})

// for Facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'parrotBot') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})


// API End Point - added by Stefan

app.post('/webhook/', function (req, res) {
    messaging_events = req.body.entry[0].messaging
    for (i = 0; i < messaging_events.length; i++) {
        event = req.body.entry[0].messaging[i]
        sender = event.sender.id
        if (event.message && event.message.text) {
            text = event.message.text

            if(text.substring(0,6) == "parrot") {
                sendTextMessage(sender, text.substring(7,200))
                continue
            }
            else if(text == 'hi' || text == 'hello' || text == 'hey' || text == 'whats up' || text == 'howdy') {
                var URL = "https://graph.facebook.com/v2.6/" + sender + "?fields=first_name&access_token=EAANGyeqRbP4BAL4qOjj2EgeiTCEEoNDg8OeuykOmTnHZC8P2VpEmVMKpAvCVLxF50p7ZARtahrYbMcvV14oH2VIOQDk5srjgQlQxKbEsZArbUZCZCUBkKaZA2IReylaHxY2Av0Be2exmqfjcZAo7RJZAdroNg1SAOsCceomp0y8pJgZDZD"
                 requestify.get(URL).then(function(response) {
                    // Get the response body
                    var rep = response.getBody();
                    var repText = "Hello, " + rep.first_name 
                    sendTextMessage(sender, repText)   

                });   
            }
            else if(text.toLowerCase() == 'what is the weather?') {
                sendTextMessage(sender, "Where exactly?")
            }


              else if(text == 'info') {
                //function...

                var URL = "https://graph.facebook.com/v2.6/" + sender + "?fields=first_name&access_token=EAANGyeqRbP4BAL4qOjj2EgeiTCEEoNDg8OeuykOmTnHZC8P2VpEmVMKpAvCVLxF50p7ZARtahrYbMcvV14oH2VIOQDk5srjgQlQxKbEsZArbUZCZCUBkKaZA2IReylaHxY2Av0Be2exmqfjcZAo7RJZAdroNg1SAOsCceomp0y8pJgZDZD"
                 requestify.get(URL).then(function(response) {
                    // Get the response body
                    var rep = response.getBody();
                    //var repText = "Hello, " + rep.first_name 
                    //sendTextMessage(sender, repText)
                    startInfo(sender, rep.first_name);

                });   



            }
            else if(text.substring(0,2) == 'in' || text.includes("what is the weather in")) {

                if(text.substring(0,2) == 'in') {
                    var place = text.substring(3,200)

                }
                else {
                    var place = text.substring(22,300)
                }
                var URL = 'http://api.openweathermap.org/data/2.5/weather?q= ' + place + '&APPID=2ddd57c19f8c98af663921918a7507ab&units=imperial'



                 requestify.get(URL).then(function(response) {
                    // Get the response body

                    var rep = response.getBody();
                    var respText = "The weather in " + rep.name + " is " + rep.main.temp + " degrees fahrenheit" 

                    sendTextMessage(sender, respText)   

                });   

            }

            else if(text.substring(0,2) == 'ip') {
                sendTextMessage(sender,"generating..")

                var ip =text.substring(3,200)
                var URL = 'http://api.ipinfodb.com/v3/ip-city/?key=57a270e806c9470043d95781a3fcef13a6b86fa75c05ffd6908308d0dd1e4143&ip=' + ip + '&format=json'

                requestify.get(URL).then(function(response) {
                    // Get the response body

                    var rep = response.getBody();
                    var repText = "The IP you requested is from " + rep.cityName + ", " + rep.regionName + ", " + rep.zipCode


                    sendTextMessage(sender, repText)   

                });     
                                        }
            else if(text == "img") {
                sendImg(sender)
            }

            else if(text.includes('joke')) {
                sendTextMessage(sender, "no.")

            }
            else if (text.includes('red dress')) {
                sendTextMessage(sender, "Matching you're query for red dresses")
                sendGenericMessage(sender)

                if(text == "\"Added to Cart!\"") {
                    sendTextMessage(sender, "Added to Cart!")
                }
                continue
            }

            else if(text == 'how are you today?') {
                sendTextMessage(sender, "I'm not bad actually, welcome to mavatar!")
                continue
            }

            else if(text == 'shop') {

                sendTextMessage("Browse through mavatar's entire shop platform... try Something like \"Red Dress\" to get started ")
                sendGenericMessage(sender)

            }
            else {
                sendTextMessage(sender, "parrot doesn't understand yet.. parrot is simple!!!!!!")

            }

            //sendTextMessage(sender, "parrot: " + text.substring(0, 200))
        }
        if (event.postback) {
            text = JSON.stringify(event.postback)
            sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token)
            continue
        }
    }
    res.sendStatus(200)
})

var token = "EAANGyeqRbP4BAL4qOjj2EgeiTCEEoNDg8OeuykOmTnHZC8P2VpEmVMKpAvCVLxF50p7ZARtahrYbMcvV14oH2VIOQDk5srjgQlQxKbEsZArbUZCZCUBkKaZA2IReylaHxY2Av0Be2exmqfjcZAo7RJZAdroNg1SAOsCceomp0y8pJgZDZD"

// function to echo back messages - added by Stefan

function startInfo(sender, name) {

    messageData = {

        "text": "Hello " + name + ", Welcome to the Mavatar TestBot. Where you can instantly shop for retail clothes, create and share trendy carts, and find the best possible deals on your favorite items! How would you like to start out today?",
        "quick_replies": [{
            "content_type": "text",
            "title": "Shop",
            "payload": "shop_payload"
            }

            {
            "content_type": "text",
            "title": "View User Carts",
            "payload": "cart_payload"
            }
             {
            "content_type": "text",
            "title": "Hottest Deals",
            "payload": "cart_payload"
            }


            ]
    }
     request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })


}


function sendImg(sender) {

    messageData = {
        "text":"Pick a color:",
    "quick_replies":[
      {
        "content_type":"text",
        "title":"Red",
        "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
      },
      {
        "content_type":"text",
        "title":"Green",
        "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_GREEN"
      }
    ]
    }

     request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })

}

function sendTextMessage(sender, text) {
    messageData = {
        text:text
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}



// Send an test message back as two cards.


function sendGenericMessage(sender) {
    messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Macy's Red Dress",
                    "subtitle": "Slick and Clean",
                    "image_url": "https://s32.postimg.org/4dc1rhfmt/rd1.jpg",
                    "buttons": [{
                        "type": "web_url",
                        "url": "https://mavatar.com/catalog/product?category_order=0&no=12&order=3&prev_category=852&price_from=1&price_to=8&product_id=2304585",
                        "title": "Open in Browser"
                    }, {
                        "type": "postback",
                        "title": "Add to Cart",
                        "payload":"Added to Cart!"
                    },],
                }, {
                    "title": "Bloomingdale's Red Dress ",
                    "subtitle": "Smells Like Roses",
                    "image_url": "https://s32.postimg.org/ypwiy4qyd/rd2.jpg",
                    "buttons": [{
                       "type": "web_url",
                        "url": "https://mavatar.com/catalog/product?category_order=0&no=12&order=3&prev_category=852&price_from=1&price_to=8&product_id=2304585",
                        "title": "Open in Browser"
                    },{
                        "type": "postback",
                        "title": "Add to Cart",
                        "payload":"Added to Cart!"
                    }, ],
                },  {
                    "title": "Sak's Fifth Avenue Dress",
                    "subtitle": "Will make you shine! ",
                    "image_url": "https://s32.postimg.org/6fksu5wz9/rd3.jpg",
                    "buttons": [{
                       "type": "web_url",
                        "url": "https://mavatar.com/catalog/product?category_order=0&no=8&order=3&price_from=1&price_to=8&product_id=3870787",
                        "title": "Open in Browser"
                    },{
                        "type": "postback",
                        "title": "Add to Cart",
                        "payload":"Added to Cart!"
                    }, ],
                }]  
            } 
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

