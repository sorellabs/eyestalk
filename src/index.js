/// index.js --- Observables for your daily JavaScript
//
// Copyright (c) 2012 Quildreen Motta
//
// Permission is hereby granted, free of charge, to any person
// obtaining a copy of this software and associated documentation files
// (the "Software"), to deal in the Software without restriction,
// including without limitation the rights to use, copy, modify, merge,
// publish, distribute, sublicense, and/or sell copies of the Software,
// and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

/// Module eyestalk
var Eventful = require('ekho').Eventful
var keys = Object.keys

var Observable = Eventful.derive({
  init:
  function _init() {
    Eventful.init.call(this)
    this.attributes = {}
    return this }

, put:
  function _put(key, value) {
    this.attributes['@' + key] = value
    this.trigger('put', key, value)
    return this }

, remove:
  function _remove(key, value) {
    if (this.has_key_p(key)) {
      delete this.attributes['@' + key]
      this.trigger('remove', key) }
    return this }

, at:
  function _at(key, _default) {
    return this.has_key_p(key)?  this.attributes['@' + key]
    :      /* otherwise */       _default }

, size:
  function _size() {
    return keys(this.attributes).length }

, empty_p:
  function _empty_p() {
    for (var key in this.attributes) return false
    return true }

, has_key_p:
  function _has_key_p(key) {
    return ('@' + key) in this.attributes }

, keys:
  function _keys() {
    return keys(this.attributes).map(function(key){ return key.slice(1) }) }

, toJSON:
  function _toJSON() {
    return this.keys()
               .reduce( function(result, key) {
                          result[key] = this.at(key)
                          return result }.bind(this)
                      , {} )}
})


module.exports = { Observable: Observable }