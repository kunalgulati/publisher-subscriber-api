### Published Subscriber API

A user can subscribe to multiple topics and every time someone publishes a message to that topic, all the subscribers will receive a POST request on the provided endpoint, with the latest published message

Subscribe to a {TOPIC}:

```curl -X POST -d '{"url": "http://localhost:8000/event"}' -H "Content-Type: application/json" http://localhost:8000/subscribe/topic1```

Publish a Message:

``` curl -X POST -H "Content-Type: application/json" -d '{"message": "hello"}' http://localhost:8000/publish/topic1 ```

The api with send a message to 

```http://localhost:8000/event```

### Steps to run 

```
Download/Clone the repo
npm install
npm start or node server.js
```


## Test Suite

Integration Test cases are testing the API endpoints 
Unite Test cases are testing the Helper function

### Run Test Suite
```
npm test test/integration/server.js
npm test test/unit/helper.js
```
