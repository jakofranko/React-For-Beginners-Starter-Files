import React from 'react';
import AddFishForm from './AddFishForm';
import base from '../base';

class Inventory extends React.Component {
    constructor() {
        super();
        this.renderInventory = this.renderInventory.bind(this);
        this.renderLogin = this.renderLogin.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.authenticate = this.authenticate.bind(this);
        this.authHandler = this.authHandler.bind(this);
        this.logout = this.logout.bind(this);

        this.state = {
            uid: null,
            owner: null
        };
    }

    componentDidMount() {
        // If the user has already logged in, pass them through to the authHandler
        base.onAuth((user) => {
            if(user) {
                this.authHandler(null, { user });
            }
        });
    }

    handleChange(e, key) {
        const fish = this.props.fishes[key];
        const updatedFish = {
            ...fish,
            [e.target.name]: e.target.value
        };
        this.props.updateFish(key, updatedFish);
    }

    authenticate(provider) {
        console.log(`Trying to log in as ${provider}`);
        base.authWithOAuthPopup(provider, this.authHandler)
    }

    authHandler(err, authData) {
        if(err) {
            console.error(err);
            return;
        }

        // Get info from firebase
        const storeRef = base.database().ref(this.props.storeId);

        storeRef.once('value', (snapshot) => {
            const data = snapshot.val() || {};

            if(!data.owner) {
                storeRef.set({
                    owner: authData.user.uid
                });
            }

            this.setState({
                uid: authData.user.uid,
                owner: data.owner || authData.user.uid
            });
        });
    }

    logout() {
        base.unauth();
        this.setState({ uid: null });
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
                <button onClick={() => this.props.removeFish(key)}>Remove Fish</button>
            </div>
        )
    }

    renderLogin() {
        return (
            <nav className="login">
                <h2>Inventory</h2>
                <p>Sign in to manage your store's inventory</p>
                <button className="github" onClick={() => this.authenticate('github')} >Login with GitHub</button>
                <button className="facebook" onClick={() => this.authenticate('facebook')} >Log in with Facebook</button>
                <button className="twitter" onClick={() => this.authenticate('twitter')} >Log in with Twitter</button>
            </nav>
        )
    }

    render() {
        const logout = <button onClick={this.logout}>Log Out!</button>;

        if(!this.state.uid) {
            return <div>{this.renderLogin()}</div>
        }

        if(this.state.uid !== this.state.owner) {
            return (
                <div>
                    <p>Sorry, you aren't the owner of this store!</p>
                    {logout}
                </div>
            )
        }

        return (
            <div>
                <h2>Inventory</h2>
                {logout}
                {Object.keys(this.props.fishes).map(this.renderInventory)}
                <AddFishForm addFish={this.props.addFish} />
                <button onClick={this.props.loadSamples}>Load Sample Data</button>
            </div>
        )
    }
}

Inventory.propTypes = {
    updateFish: React.PropTypes.func.isRequired,
    removeFish: React.PropTypes.func.isRequired,
    fishes: React.PropTypes.object.isRequired,
    addFish: React.PropTypes.func.isRequired,
    loadSamples: React.PropTypes.func.isRequired,
    storeId: React.PropTypes.string.isRequired
};

export default Inventory;
