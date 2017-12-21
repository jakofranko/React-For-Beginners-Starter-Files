import React from 'react';

import Header from './Header';
import Order from './Order';
import Inventory from './Inventory';
import Fish from './Fish';

import base from '../base';
import sampleFishes from '../sample-fishes';

class App extends React.Component {
    state = {
        fishes: {},
        order: {}
    };

    static propTypes = {
        params: React.PropTypes.object.isRequired
    }

    componentWillMount() {
        // This runs right before the app is rendered
        this.ref = base.syncState(`${this.props.params.storeId}/fishes`, {
            context: this,
            state: 'fishes'
        });

        // Check if there is any order in localStorage
        const localStorageRef = localStorage.getItem(`order-${this.props.params.storeId}`);

        if(localStorageRef)
            this.setState({
                order: JSON.parse(localStorageRef)
            });
    }

    componentWillUnmount() {
        base.removeBinding(this.ref);
    }

    componentWillUpdate(nextProps, nextState) {
        localStorage.setItem(`order-${this.props.params.storeId}`, JSON.stringify(nextState.order));
    }

    addFish = (fish) => {
        // update state
        // copy of existing state
        const fishes = {...this.state.fishes};

        // add new fish
        const timestamp = Date.now();
        fishes[`fish-${timestamp}`] = fish;

        // set state
        // we set the state via this function so that React can make sure that
        // there isn't a race condition that would cause the state to be in an
        // unpredictable condition.
        // Additionally, we don't just update the entire state, we specify which
        // part of the state we are wanting to update. In this case: fishes
        this.setState({ fishes })
    };

    updateFish = (key, updatedFish) => {
        const fishes = {...this.state.fishes};
        fishes[key] = updatedFish;
        this.setState({ fishes });
    };

    removeFish = (key) => {
        const fishes = {...this.state.fishes};
        fishes[key] = null; // Firebase doesn't handle just del
        this.setState({ fishes });
    };

    loadSamples = () => {
        this.setState({
            fishes: sampleFishes
        });
    };

    addToOrder = (key) => {
        // copy state
        const order = {...this.state.order};

        order[key] = order[key] + 1 || 1;

        this.setState({ order });
    };

    removeFromOrder = (key) => {
        const order = {...this.state.order};
        delete order[key];
        this.setState({ order });
    };

    render() {
        return (
            <div className="catch-of-the-day">
                <div className="menu">
                    <Header tagline="Fresh Seafood Market" />
                    <ul className="list-of-fishes">
                        {
                            Object
                                .keys(this.state.fishes)
                                .map(key => <Fish key={key} index={key} details={this.state.fishes[key]} addToOrder={this.addToOrder}/>)
                        }
                    </ul>
                </div>
                <div className="menu">
                    <Order
                        fishes={this.state.fishes}
                        order={this.state.order}
                        params={this.props.params}
                        removeFromOrder={this.removeFromOrder} />
                </div>
                <div className="menu">
                    <Inventory
                        addFish={this.addFish}
                        updateFish={this.updateFish}
                        removeFish={this.removeFish}
                        loadSamples={this.loadSamples}
                        fishes={this.state.fishes}
                        storeId={this.props.params.storeId} />
                </div>
            </div>
        )
    }
}

export default App;
