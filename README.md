# connect-alt
> Decorator for passing alt store state through props, heavily inspired from `react-redux::connect`

## Usage

> $ npm i -S connect-alt

1. Create a FinalStore on AltJS instance:

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

2. Use the decorator in your components

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
