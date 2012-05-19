describe('{} Observable', function() {
  var ensure = require('noire').ensure
  var sinon  = require('sinon')
  var _      = require('../')

  var o, stub
  beforeEach(function() {
    o = _.Observable.make()
    stub = sinon.stub()
  })

  describe('λ put', function() {
    it('Should set the key/value pair.', function() {
      o.put('foo', 'bar')
      ensure(o.at('foo')).same('bar')
    })
    it('Should fire a `put` event with the key/value pair.', function() {
      o.on('put', stub)
      o.put('foo', 'bar')
      ensure(stub).property('callCount').same(1)
      ensure(stub.args[0].slice(1)).equals(['foo', 'bar'])
    })
  })

  describe('λ update', function() {
    it('Should import the key/value pairs from one dictionary into the object.', function() {
      o.update({ a: 1, b: 2, c: 3 })
      ensure(o.at('a')).same(1)
      ensure(o.at('b')).same(2)
      ensure(o.at('c')).same(3)
    })
    it('Should fire a `put` event for each key/value pair.', function() {
      o.on('put', stub)
      o.update({ a: 1, b: 2, c: 3 })
      ensure(stub).property('callCount').same(3)
      ensure(stub.args[0].slice(1)).equals(['a', 1])
      ensure(stub.args[1].slice(1)).equals(['b', 2])
      ensure(stub.args[2].slice(1)).equals(['c', 3])
    })
    it('Should trigger an `update` event after updating.', function() {
      var x = { a: 1, b: 2, c: 3 }
      o.on('update', stub)
      o.update(x)
      ensure(stub).property('callCount').same(1)
      ensure(stub.args[0][1]).same(x)
    })
  })

  describe('λ remove', function() {
    it('Should remove a key/value pair.', function() {
      o.put('foo', 'bar')
      o.remove('foo')
      ensure(o.at('foo')).same(undefined)
    })
    it('Given the key existed, should fire a `remove` event with the removed key.', function() {
      o.put('foo', 'bar')
      o.on('remove', stub)
      o.remove('foo')
      ensure(stub).property('callCount').same(1)
      ensure(stub.args[0].slice(1)).equals(['foo'])
    })
    it('Given no such key, shouldn\'t fire a `remove` event.', function() {
      o.on('remove', stub)
      o.remove('foo')
      ensure(stub).property('callCount').same(0)
    })
  })

  describe('λ at', function() {
    it('Should return the value for the given key.', function() {
      o.put('foo', 'bar')
      ensure(o.at('foo')).same('bar')
    })
    it('Should return the given default value if no association exists.', function() {
      ensure(o.at('foo')).same(undefined)
      ensure(o.at('foo', 'lol')).same('lol')
    })
  })

  describe('λ size', function() {
    it('Should return the number of key/value pairs.', function() {
      ensure(o).invoke('size').same(0)
      o.put('foo', 1).put('bar', 2)
      ensure(o).invoke('size').same(2)
    })
  })

  describe('λ emtpy?', function() {
    it('Should return false if the object has keys.', function() {
      o.put('foo', 1)
      ensure(o).invoke('empty_p').not().ok()
    })
    it('Should return true otherwise.', function() {
      ensure(o).invoke('empty_p').ok()
    })
  })

  describe('λ has-key?', function() {
    it('Should return true if there exists an association for the given key.', function() {
      o.put('foo', 1)
      ensure(o).invoke('has_key_p', 'foo').ok()
    })
    it('Should return false otherwise.', function() {
      ensure(o).invoke('has_key_p', 'foo').not().ok()
    })
  })

  describe('λ keys', function() {
    it('Should return the list of all keys in the object.', function() {
      ensure(o).invoke('keys').equals([])
      o.put('foo', 1).put('bar', 2).put('baz', 3)
      ensure(o).invoke('keys').property('length', 3)
      ensure(o).invoke('keys').contains('foo')
      ensure(o).invoke('keys').contains('bar')
      ensure(o).invoke('keys').contains('baz')
    })
  })

  describe('λ toJSON', function() {
    it('Should return a JSON representation of the object\'s state.', function() {
      o.put('foo', 1)
       .put('bar', 'baz')
       .put('lol', true)
       .put('no', null)
      ensure(o).invoke('toJSON').equals({ foo: 1
                                        , bar: 'baz'
                                        , lol: true
                                        , no:  null })
    })
  })
})