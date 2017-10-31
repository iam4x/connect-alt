import React from 'react';
import PropTypes from 'prop-types';
import PureComponent from 'react-pure-render/component';

// Default `fn` property names
// can vary on browsers
const excludedProps = Object.getOwnPropertyNames(function() {});

// borrowed from `react-redux/connect`
// https://github.com/rackt/react-redux/blob/master/src/components/connect.js#L17
function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component'
}

export default function connectToStores(...connectArgs) {
  return function(DecoratedComponent) {
    class ConnectToStoresWrapper extends PureComponent {

      static contextTypes = { flux: PropTypes.object.isRequired }
      static displayName = `Connect(${getDisplayName(DecoratedComponent)})`
      static decoratedComponent = DecoratedComponent

      constructor(props, context) {
        super(props, context);

        // if we have a reducer fn as first arg we
        // will call this fn on the full alt state
        if (typeof connectArgs[0] === 'function') {
          this.state = {
            connectType: 'reducerFn',
            customProps: connectArgs[0](this.takeSnapshot())
          };
        } else if (typeof connectArgs[connectArgs.length - 1] === 'function') {
          // if we have a reducer fn as the last arg we
          // will call this fn on the full alt state
          this.state = {
            connectType: 'storesReducerFn',
            customProps: connectArgs[connectArgs.length - 1](this.takeSnapshot())
          };
        } else if (typeof connectArgs[0] === 'string') {
          // if it's string it will be stores names,
          // we want to provide the stores state into props
          const { flux } = this.context;
          this.state = {
            connectType: 'storesState',
            customProps: connectArgs.reduce((states, storeName) =>
              ({
                ...states,
                [storeName + 'Store']: flux.getStore(storeName).getState()
              }), {})
          }
        }
      }

      componentDidMount() {
        const { connectType } = this.state;
        const { flux } = this.context;

        switch (connectType) {
          case 'reducerFn':
            flux.FinalStore.listen(this.handleStoresChange);
            // a store update may have been updated between state
            // initialization and listening for changes from store
            this.handleStoresChange();
            break;

          case 'storesState':
            // bind every store to a listener
            connectArgs.forEach((storeName) => {
              const listener = this.handleStoreChange(storeName);
              this.listeners = this.listeners ?
                [ ...this.listeners, { [storeName]: listener } ] :
                [ { [storeName]: listener } ];

              flux.getStore(storeName).listen(listener);
            });
            // same as `this.handleStoresChange()` after listening
            this.listeners.forEach(listenerProps => {
              const [ storeName ] = Object.keys(listenerProps);
              const storeListener = listenerProps[storeName];
              return storeListener();
            });
            break;

          case 'storesReducerFn':
            // bind every specified store to the handleStoresChange listener
            connectArgs.forEach((storeName) => {
              if (typeof storeName === 'string') {
                flux.getStore(storeName).listen(this.handleStoresChange);
              }
            });
            // a store update may have been updated between state
            // initialization and listening for changes from store
            this.handleStoresChange();
            break;
        }
      }

      componentWillUnmount() {
        const { connectType } = this.state;
        const { flux } = this.context;

        switch (connectType) {
          case 'reducerFn':
            flux.FinalStore.unlisten(this.handleStoresChange);
            break;

          case 'storesState':
            this.listeners.forEach(listenerProps => {
              const [ storeName ] = Object.keys(listenerProps);
              const storeListener = listenerProps[storeName];
              flux.getStore(storeName).unlisten(storeListener);
            });
            this.listeners = null;
            break;

          case 'storesReducerFn':
            connectArgs.forEach(storeName => {
              if (typeof storeName === 'string') {
                flux.getStore(storeName).unlisten(this.handleStoresChange);
              }
            });
            this.listeners = null;
            break;
        }
      }

      takeSnapshot() {
        const { flux } = this.context;

        return Object.keys(flux.stores)
          .reduce(function (obj, storeHandle) {
            const storeName = storeHandle.displayName || storeHandle;
            obj[storeName] = flux.getStore(storeName).getState();
            return obj;
          }, {});
      }

      handleStoresChange = () => {
        return this.setState({
          ...this.state,
          customProps: connectArgs[connectArgs.length - 1](this.takeSnapshot())
        });
      }

      handleStoreChange = (storeName) => {
        const { flux } = this.context;

        return () => {
          return this.setState({
            ...this.state,
            customProps: {
              ...this.state.customProps,
              [storeName + 'Store']: flux.getStore(storeName).getState()
            }
          });
        }
      }

      render() {
        const { customProps } = this.state;
        return (
          <DecoratedComponent
            ref={ DecoratedComponent.prototype.setState ? 'decorated' : undefined }
            { ...this.props }
            { ...customProps } />
        );
      }
    }

    // Copy static methods on decorated component
    // usefull is you define `onEnter` hook for `react-router`
    Object.getOwnPropertyNames(DecoratedComponent).forEach(function(prop) {
      // Copy only fn and not defined ones on `ConnectToStoresWrapper`
      if (excludedProps.indexOf(prop) < 0 &&
          typeof DecoratedComponent[prop] === 'function' &&
          !ConnectToStoresWrapper[prop]) {
        const staticMethod = DecoratedComponent[prop];
        ConnectToStoresWrapper[prop] = staticMethod;
      }
    });

    return ConnectToStoresWrapper;
  };
}
