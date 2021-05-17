import React, { Component } from 'react';
import factory from '../ethereum/factory';
import { Card, Button, Menu } from 'semantic-ui-react';
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
                {/* Create Campaign button is generated before our list of Campaigns */}
                <Button floated="right" content="Create Campaign" icon="add" primary />
                {this.renderCampaigns()}
            </div>
            </Layout>
            );
    }
}

export default CampaignIndex;