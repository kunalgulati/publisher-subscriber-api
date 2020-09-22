const express = require('express');
const bodyParser = require('body-parser');
const async = require("async");
const axios = require('axios');

/** Helper */
const helper = require('./lib/helper')

const app = express();
const PORT = 8000;

/** In-memory data structure to store mapping between topics and subscriber links  */
const subscribeMap = new Map()

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/** 
 * {SUBSCRIBE}
 * In-memory, Mapping between topics and subscribers. Check if the topic related subscriber already list exists:
    * If True, add the new URL to the existing lists 
    * If False, create a new mapping and add the URL to the list 
*/
app.post('/subscribe/:topic', (req, res) => {
    const topic = req.params.topic;
    const url = req.body.url;

    /** If the url is empty then return an appropriate error */
    if (url == undefined || url == "") {
        return res.status(400).send('Request Rejected because no url was provided')
    }
    /** Map topic to subscribed links */
    if (subscribeMap.has(topic)) { subscribeMap.get(topic).push(url) } else { subscribeMap.set(topic, [url]); }
    console.log(subscribeMap)
    /** Return 201 code because a new subscription was created.  */
    res.status(201).send(`messagefully subscribed to topic: ${topic}`)
})

/** 
 * {EVENT}
 * Listen to all the Events Post
*/
app.post('/:event', (req, res) => {
    console.log(req.body)
    // console.log(req.params.event)
    res.status(200).send("Published Message Recieved")
})

/**
 * {PUBLISH}
 * Extract the Topic and Message from the publish request, then check if any user has subscribed to the Topic. 
    * If True, then send all the subscribed users a post a request (Parallel Request to fasten the process)
    * If False, return True, with a message: no subscribers to the topic 
 */
app.post('/publish/:topic', (req, res) => {
    const topicArgs = req.params.topic;
    let subscriberData = {};
    // To ensure the code doesn't in next step (while checking if Object is empty) break if req.body = undefined
    const data = req.body || {};

    /** If the body is not empty, then extract the data */
    if ( Object.keys(req.body).length == 0) { return res.status(400).send({ message: "No message in the Publish (POST) request"}) }
    else { subscriberData = { topic: topicArgs, data: req.body } }  

    /** Get a list of all subscribers */
    const subscribersList = helper.getListOfAllSubscribers(topicArgs, subscribeMap)

    if (subscribersList.length > 0) {
        /** POST published message to all the subscribers for the {TOPIC} */
        async.mapLimit(subscribersList, 5, async function (eachUrl) {
            axios.post(eachUrl, { "data": subscriberData })
                .then((response) => {
                    /** The error handling strategy was suggested in the assignment. 
                    *   So I am returning response code = 400, when something went wrong with a POST request to a subscriber 
                    * */
                    if (response.status != 200) { return res.status(400).send({ message: "Error in Publishing data to Subscriber"} ) }
                }).catch((err) => {
                    return res.status(400).send({message: "Error in Publishing data to Subscriber"})
                });
        });
    } else {
        /** When no subscribers exit for the published topic. The code will still return status code 200, with a more descriptive message. * */
        return res.status(200).send({ message: "No subscribers exists for the Published Topic"} )
    }
    return res.status(200).send({message: "Succesfully published data to all the subscribers"})
})

app.listen(PORT, () => {
    console.log(`server is listening on PORT ${PORT}`);
})

