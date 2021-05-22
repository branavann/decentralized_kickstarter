import React, { Component } from 'react';
import Layout from '../../../components/Layout';
import Campaign from '../../../ethereum/campaign';
import web3 from '../../../ethereum/web3';
import { Button, Form, Input, Message } from 'semantic-ui-react';
import { Link, Router } from '../../../routes';

class RequestNew extends Component {

    state = {
        value: '',
        description: '',
        receipient: '',
        errorMessage: '',
        loading: false
    }

    static async getInitialProps(props) {
        const { address } = props.query;
        return { address };
    }

    onSubmit = async event => {
        event.preventDefault();

        // Gathering the instance of our campaign
        const campaign = Campaign(this.props.address);
        // Destructuring our state variables 
        const { value, description, receipient } = this.state;

        this.setState({ errorMessage: '', loading: true });
        try {
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.createRequest(description, web3.utils.toWei(value, 'ether'), receipient).send({ from: accounts[0] });
            // Navigate users back to the requests home page
            Router.pushRoute(`/campaigns/${this.props.address}/requests`);
        } catch (err) {
            this.setState({ errorMessage: err.message });
        };

        // Stops the spinner on the button 
        this.setState({ loading: false });
    };

    render() {
        return (
            <Layout>
                <Link route={`/campaigns/${this.props.address}/requests`}>
                    <a>
                        Back
                    </a>
                </Link>
                <h3>Create a New Request</h3>
               <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                   <Form.Field>
                       <label>Description</label>
                       <Input 
                           value={this.state.description}
                           onChange={event => this.setState({ description: event.target.value })} 
                       />
                   </Form.Field>
                   <Form.Field>
                       <label>Value (Ether)</label>
                       <Input 
                            value={this.state.value}
                            onChange={event => this.setState({ value: event.target.value })}
                        />
                   </Form.Field>
                   <Form.Field>
                       <label>Recipient Address</label>
                       <Input 
                            value={this.state.receipient}
                            onChange={event => this.setState({ receipient: event.target.value })}
                       />
                   </Form.Field>
                   <Message error header="Could not process your request" content={this.state.errorMessage} />
                   <Button loading={this.state.loading} secondary>
                        Create
                   </Button>
               </Form>
            </Layout>
            
        );
    }
}

export default RequestNew;
