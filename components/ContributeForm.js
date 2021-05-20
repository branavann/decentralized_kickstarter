import Router from 'next/router';
import React, { Component } from 'react';
import { Button, Form, Input, Message } from 'semantic-ui-react';
import Campaign from '../ethereum/campaign';
import web3 from '../ethereum/web3';

class ContributeForm extends Component {

    state = {
        value: '',
        loading: false,
        errorMessage: ''
    };

    onSubmit = async event => {
        event.preventDefault();
        // Address is provided from show.js
        const campaign = Campaign(this.props.address);
        // Resets our error message and begins the spinner 
        this.setState({ loading: true, errorMessage: '' });
        try {
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.contribute().send({ from: accounts[0], value: web3.utils.toWei(this.state.value, 'ether') });
            Router.replaceRoute(`/campaigns/${this.props.address}`);
        } catch (err) {
            this.setState({ errorMessage: err.message });
        }
        // Resets the form and turns off the spinner 
        this.setState({ loading: false, value: '' });
    };

    render() {
        return (
            <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                <Form.Field>
                    <label>Contribution Value</label>
                    <Input
                        value={this.state.value}
                        onChange={event => this.setState({ value: event.target.value })}
                        label='ether'
                        labelPosition='right'
                    />
                </Form.Field>
                <Message error header='Could not process your transaction' content={this.state.errorMessage} />
                <Button loading={this.state.loading} secondary>Contribute</Button>
            </Form>
        );
    }
}

export default ContributeForm;
