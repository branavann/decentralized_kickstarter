import React, { Component } from 'react';
import Layout from '../../components/Layout';
import Campaign from '../../ethereum/campaign';
import { Button, Card, Grid } from 'semantic-ui-react';
import web3 from '../../ethereum/web3';
import ContributeForm from '../../components/ContributeForm';
import { Link } from '../../routes';

class CampaignShow extends Component {
    static async getInitialProps(props) {
        // Returns an instance our deployed contract 
        const campaign = Campaign(props.query.address);
        const summary = await campaign.methods.getSummary().call();
        // NextJS requires us to return an object within getIntialProps
        return {
            address: props.query.address,
            minimumContribution: summary[0],
            balance: summary[1],
            requests: summary[2],
            contributorsCount: summary[3],
            manager: summary[4]
        };
    }

    renderCards() {

        // Destructuring this.props
        const {minimumContribution, balance, requests, contributorsCount, manager} = this.props;

        const items = [
            {
                header: manager,
                meta: "Address of Manager",
                description: "The manager is the individual that created the campaign. They have the ability to create requests to withdraw funds, which contributors can vote on.",
                style: { overflowWrap: 'break-word' }
            },
            {
                header: minimumContribution,
                meta: "Minimum Contribution (wei)",
                description: "The minimum amount of wei required to become a contributor"
            },
            {
                header: requests,
                meta: "Number of Requests",
                description: "A request attempts to withdraw money for a pre-define case. Contributors can vote to approve the request. "
            },
            {
                header: contributorsCount,
                meta: "Number of Contributors",
                description: "The number of individuals that have contributed to the campaign"
            },
            {
                header: web3.utils.fromWei(balance,'ether'),
                meta: "Campaign Balance (ether)",
                description: "The amount of ether remaining within the campaign. This value will fluctate as different requests are approved."
            }
        ];
        
        return <Card.Group items={items} />;

    }

    render() {
        return (
            <Layout>
                <h3>Campaign Show</h3>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={10}>
                            {this.renderCards()}
                        </Grid.Column>
                        <Grid.Column width={6}>
                            <ContributeForm address={this.props.address} />
                        </Grid.Column>
                    </Grid.Row>

                    <Grid.Row>
                        <Grid.Column>
                            <Link route={`/campaigns/${this.props.address}/requests`}>
                                <a>
                                    <Button secondary>View Campaign Requests</Button>
                                </a>
                            </Link>   
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Layout>
        );
    }
}

export default CampaignShow;