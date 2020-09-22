const getListOfAllSubscribers = (topicParam, subscribeMap) => {
  if (subscribeMap.has(topicParam)) { return subscribeMap.get(topicParam); } else { return [] }
}

module.exports = {
  getListOfAllSubscribers,
}
