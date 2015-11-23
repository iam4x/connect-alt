import test from 'tape';
import React, { Component } from 'react';

import connect from './main';

function noop() {};

test('should decorate component', function(t) {
  class Dummy extends Component {}
  const decorated = connect(noop)(Dummy);

  t.equal(decorated.name, 'ConnectToStoresWrapper');
  t.equal(typeof decorated.contextTypes, 'object');

  t.end();
});

test('should copy static methods on decorated component', function(t) {
  class Dummy extends Component {
    static fetchData() {}
    static fetchData_ = noop
    static fetchData__ = () => noop()
  }
  const decorated = connect(noop)(Dummy);

  t.equal(typeof decorated.fetchData, 'function');
  t.equal(typeof decorated.fetchData_, 'function');
  t.equal(typeof decorated.fetchData__, 'function');
  t.end();
});
