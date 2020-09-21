const express = require('express');
const bodyParser = require('body-parser');
const async = require("async");
const axios = require('axios');

const app = express();
const PORT = 8000;

/** In-memory data structure to store mapping between topics and subscriber links  */
const subscribeMap = new Map()

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/** Helper */
const getListOfAllSubscribers = (topicParam) => {
    if (subscribeMap.has(topicParam)) { return subscribeMap.get(topicParam); } else { return [] }
}

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
        res.status(400).send('Request Rejected because no url was provided')
        return 0;
    }
    /** Map topic to subscribed links */
    if (subscribeMap.has(topic)) { subscribeMap.get(topic).push(url) } else { subscribeMap.set(topic, [url]); }
    console.log(subscribeMap)
    /** Return 201 code because a new subscription was created.  */
    res.status(201).send(`Successfully subscribed to topic: ${topic}`)
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
 * Extract the TOPIC for which the new published message is for 
 * Extract the MESSAGE 
 * Check if any users have subscribed to the TOPIC 
 * If True, then send all of them a post a request (Parallel Request to fasten the process)
 * If False, return True, with a message: no subscribers to the topic 
 */
app.post('/publish/:topic', (req, res) => {
    const topicArgs = req.params.topic;
    let subscriberData = {}

    /** If the body is not empty, then extract the data */
    if (req.body != {}) { subscriberData = { topic: topicArgs, data: req.body } } else { subscriberData = { topic: topicArgs, data: "" } }
    /** Get a list of all subscribers */
    const subscribersList = getListOfAllSubscribers(topicArgs)

    if (subscribersList.length > 0) {
        /** POST published message to all the subscribers for the {TOPIC} */
        async.mapLimit(subscribersList, 5, async function (eachUrl) {
            axios.post(eachUrl, { "data": subscriberData })
                .then((res) => {
                    /** The error handling strategy was suggested in the assignment. 
                    *   So I am returning response code = 400, when something went wrong with a POST request to a subscriber 
                    * */
                    if (res.status != 200) { res.send(400).send("Error in Publishing data to Subscriber") }
                }).catch((err) => {
                    console.error(err);
                    return res.send(400).send("Error in Publishing data to Subscriber")
                });
        });
    } else {
        /** When no subscribers exit for the published topic. The code will still return status code 200, with a more descriptive message. * */
        return res.status(200).send("No subscribers exists for the Published Topic")
    }

    return res.status(200).send("Succesfully published data to all the subscribers")
})

app.listen(PORT, () => {
    console.log(`server is listening on PORT ${PORT}`);
})

