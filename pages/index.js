import React, { Component } from 'react';
import factory from '../ethereum/factory';
import { Card, Button } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import Layout from '../components/Layout';

class CampaignIndex extends Component {

    // Static enables us to call function directly from the class
    static async getInitialProps() {
        // Returns an array of deployed campaign addresses
        const campaigns = await factory.methods.getDeployedCampaigns().call();
        return { campaigns };
    }

    renderCampaigns() {
        const items = this.props.campaigns.map(address => {
            return {
                header: address,
                description: <a>View Campaign</a>,
                fluid: true
            };
        });

        return <Card.Group items={items} />;
    }

    render() {
        return (
            <Layout>
            <div>
                <h3>Open Campaigns</h3>
                {this.renderCampaigns()}
                <Button content="Create Campaign" icon="add" primary />
            </div>
            </Layout>
            );
    }
}

export default CampaignIndex;