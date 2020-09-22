const chai = require('chai');
const expect = chai.expect;
const helper = require('../../lib/helper');

/** Group Individual Tests using Describe block */

describe('Publish-Subscribe API Helper Function', function () {
  context('Test Helper Function', function () {
    const hashMap = new Map();
    hashMap.set('event', [ 'http://localhost:8000/event', 'http://localhost:8000/event2'] )

    it('Check if the map return the correct Array for a key (Topic) which already exists in the Map', function () {
      expect(helper.getListOfAllSubscribers('event', hashMap))
        .to.deep.equal(['http://localhost:8000/event', 'http://localhost:8000/event2']);
    });
    
    it('Check if the map return an Empty Array for a key(Topic) which does not exists in the Map', function () {
      expect(helper.getListOfAllSubscribers('event-notexisting', hashMap))
        .to.deep.equal([]);
    });
  })
});
