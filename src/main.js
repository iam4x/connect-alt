import React, { Component, PropTypes } from 'react';

export default function connectToStores(reducer) {
  return function(DecoratedComponent) {
    class ConnectToStoresWrapper extends Component {
      static contextTypes = { flux: PropTypes.object.isRequired }

      constructor(props, context) {
        super(props, context);
        const { flux } = this.context;
        const finalState = JSON.parse(flux.takeSnapshot());
        this.state = { customProps: reducer(finalState) };
      }

      componentDidMount() {
        const { flux } = this.context;
        flux.FinalStore.listen(this.handleStoresChange);
      }

      componentWillUnmount() {
        const { flux } = this.context;
        flux.FinalStore.unlisten(this.handleStoresChange);
      }

      handleStoresChange = () => {
        const { flux } = this.context;
        const finalState = JSON.parse(flux.takeSnapshot());
        return this.setState({ customProps: reducer(finalState) });
      }

      render() {
        const { customProps } = this.state;
        return (<DecoratedComponent { ...this.props } { ...customProps } />);
      }
    }

    return ConnectToStoresWrapper;
  };
}
