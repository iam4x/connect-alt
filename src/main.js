import React, { PropTypes } from 'react';
import PureComponent from 'react-pure-render/component';

// Default `fn` property names
// can vary on browsers
const excludedProps = Object.getOwnPropertyNames(function() {});

export default function connectToStores(reducer) {
  return function(DecoratedComponent) {
    class ConnectToStoresWrapper extends PureComponent {
      static contextTypes = { flux: PropTypes.object.isRequired }

      state = { customProps: reducer(this.takeSnapshot()) };

      componentDidMount() {
        const { flux } = this.context;
        flux.FinalStore.listen(this.handleStoresChange);
      }

      componentWillUnmount() {
        const { flux } = this.context;
        flux.FinalStore.unlisten(this.handleStoresChange);
      }

      takeSnapshot() {
        const { flux } = this.context;
        return JSON.parse(flux.takeSnapshot());
      }

      handleStoresChange = () =>
        this.setState({ customProps: reducer(this.takeSnapshot()) })

      render() {
        const { customProps } = this.state;
        return (<DecoratedComponent { ...this.props } { ...customProps } />);
      }
    }

    // Copy static methods on decorated component
    // usefull is you define `onEnter` hook for `react-router`
    Object.getOwnPropertyNames(DecoratedComponent)
      .filter((prop) => !excludedProps.includes(prop))
      .forEach(function(prop) {
        // Copy only fn and not defined ones on `ConnectToStoresWrapper`
        if (typeof DecoratedComponent[prop] === 'function' &&
            !ConnectToStoresWrapper[prop]) {
          const staticMethod = DecoratedComponent[prop];
          ConnectToStoresWrapper[prop] = staticMethod;
        }
      });

    return ConnectToStoresWrapper;
  };
}
