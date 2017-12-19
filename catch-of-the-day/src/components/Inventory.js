import React from 'react';
import AddFishForm from './AddFishForm';

class Inventory extends React.Component {
    constructor() {
        super();
        this.renderInventory = this.renderInventory.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e, key) {
        const fish = this.props.fishes[key];
        const updatedFish = {
            ...fish,
            [e.target.name]: e.target.value
        };
        this.props.updateFish(key, updatedFish);
    }

    renderInventory(key) {
        const fish = this.props.fishes[key];
        return (
            <div className="fish-edit" key={key}>
                <input name="name" value={fish.name} ref={(input) => this.name = input} type="text" placeholder="Fish Name" onChange={(e) =>this.handleChange(e, key)} />
                <select name="status" value={fish.status} ref={(input) => this.status = input}  onChange={(e) =>this.handleChange(e, key)} >
                    <option value="available">Fresh!</option>
                    <option value="unavailable">Sold Out!</option>
                </select>
                <input name="price" value={fish.price} ref={(input) => this.price = input} type="text" placeholder="Fish Status"  onChange={(e) =>this.handleChange(e, key)} />
                <textarea name="desc" value={fish.desc} ref={(input) => this.desc = input} type="text" placeholder="Fish Desc"  onChange={(e) =>this.handleChange(e, key)} ></textarea>
                <input name="image" value={fish.image} ref={(input) => this.image = input} type="text" placeholder="Fish Image"  onChange={(e) =>this.handleChange(e, key)} />
            </div>
        )
    }

    render() {
        return (
            <div>
                <h2>Inventory</h2>
                {Object.keys(this.props.fishes).map(this.renderInventory)}
                <AddFishForm addFish={this.props.addFish} />
                <button onClick={this.props.loadSamples}>Load Sample Data</button>
            </div>
        )
    }
}

export default Inventory;
