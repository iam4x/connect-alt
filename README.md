# connect-alt
> Decorator for passing alt store state through props, heavily inspired from `react-redux::connect`

## How to / Installation

> $ npm i -S connect-alt

#### II. Provide flux into your app context:

Use [AltContainer](http://alt.js.org/docs/components/altContainer/) for an easy integration:

```javascript
import { render } from 'react-dom';
import AltContainer from 'alt-container';

import Flux from './Flux';
import App from './App';

render(<AltContainer flux={ new Flux() }><App /></AltContainer>);
```

#### III. Use into your application

***This is the most performant way, it only listen for the specific store changes and not waiting for all stores to update***

```javascript
import React, { Component, PropTypes } from 'react';
import connect from 'connect-alt';

@connect('session')
class Example extends Component {

  static propTypes = { sessionStore: PropTypes.object.isRequired }

  render() {
    const { sessionStore: { currentUser } } = this.props;

    return (
      <pre>{ JSON.stringify(currentUser, null, 4) }</pre>
    );
  }
}
```

#### III. (Alternative) Use the decorator with a reducer function in your components

***Warning, this is expensive because `connect-alt` will be listening for any stores update and not the only concerned***

```javascript
import React, { Component, PropTypes } from 'react';
import connect from 'connect-alt';

@connect(({ session: { currentUser } }) => ({ currentUser })
class Example extends Component {

  static propTypes = { currentUser: PropTypes.object.isRequired }

  render() {
    const { currentUser } = this.props;

    return (
      <pre>{ JSON.stringify(currentUser, null, 4)</pre>
    );
  }

}
```

***NOTE: You will need to provide a `FinalStore` on alt instance:***

```javascript
import Alt from 'alt';
import makeFinalStore from 'alt/utils/makeFinalStore';

class Flux extends Alt {

  constructor(config) {
    super(config);
    this.FinalStore = makeFinalStore(this);
  }

}

export default Flux;
```

## Examples

See [isomorphic-flux-boilerplate](https://github.com/iam4x/isomorphic-flux-boilerplate) for a complete app example.
