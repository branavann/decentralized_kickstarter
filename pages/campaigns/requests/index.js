import React, { Component } from 'react';
import Layout from '../../../components/Layout';
import Campaign from '../../../ethereum/campaign';
import { Link } from '../../../routes';
import { Button, Table } from 'semantic-ui-react';
import RequestRow from '../../../components/RequestRow';

class RequestIndex extends Component {

    static async getInitialProps(props) {
        const { address } = props.query;
        const campaign = Campaign(address);
        const requestCount = await campaign.methods.getRequestsCount().call();
        // Used for RequestRow component 
        const contributorsCount = await campaign.methods.contributorsCount().call();
        // Gathering the requests for the specified campaign
        const requests = await Promise.all(
            Array(parseInt(requestCount)).fill().map((element, index) => {
                return campaign.methods.requests(index).call();
            })
        );

        return { address, requests, requestCount, contributorsCount };
    }

    renderRows() {
        return this.props.requests.map((request,index) => {
            return <RequestRow 
                key={index}
                id={index}
                request={request}
                address={this.props.address}
                contributorsCount={this.props.contributorsCount}
                />;
        });
    }

    render() {

        const { Header, Row, HeaderCell, Body } = Table;


        return (
            <Layout>
              <h3>Requests</h3>
              <Link route={`/campaigns/${this.props.address}`}>
                <a>Back</a>
              </Link>
              <Link route={`/campaigns/${this.props.address}/requests/new`}>
                <a>
                    <Button secondary floated='right' style={{ marginBottom: 10 }}>New Request</Button>
                </a>
              </Link>
              <Table>
                  <Header>
                      <Row>
                          <HeaderCell>ID</HeaderCell>
                          <HeaderCell>Description</HeaderCell>
                          <HeaderCell>Amount</HeaderCell>
                          <HeaderCell>Recipient</HeaderCell>
                          <HeaderCell>Approval Count</HeaderCell>
                          <HeaderCell>Approve</HeaderCell>
                          <HeaderCell>Finalize</HeaderCell>
                      </Row>
                  </Header>
                  <Body>
                      {this.renderRows()}
                  </Body>
              </Table>
              <div>Found {this.props.requestCount} requests.</div>
            </Layout>
        );
    }
}

export default RequestIndex;
