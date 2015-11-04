# connect-alt
> Decorator for passing alt store state through props, heavily inspired from `react-redux::connect`

## How to / Installation

> $ npm i -S connect-alt

#### I. Create a FinalStore on AltJS instance:

```javascript
import Alt from 'alt';
import makeFinalStore from 'alt/utils/makeFinalStore';

class Flux extends Alt {

  constructor(config) {
    super(config);
    this.FinalStore = makeFinalStore(alt);
  }

}

export default Flux;
```

#### II. Provide flux into your app context:

Use [AltContainer](http://alt.js.org/docs/components/altContainer/) for an easy integration:

```javascript
import { render } from 'react-dom';
import AltContainer from 'alt-container';

import Flux from './Flux';
import App from './App';

render(<AltContainer flux={ new Flux() }><App /></AltContainer>);
```

#### III. Use the decorator in your components

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

## Examples

See [isomorphic-flux-boilerplate](https://github.com/iam4x/isomorphic-flux-boilerplate) for a complete app example.
