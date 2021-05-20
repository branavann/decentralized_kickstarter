import React, { Component } from 'react';
import Layout from '../../../components/Layout';
import Campaign from '../../../ethereum/campaign';
import web3 from '../../../ethereum/web3';
import { Button, Form, Input, Message } from 'semantic-ui-react';
import { Link, Router } from '../../../routes';

class RequestNew extends Component {
    static async getInitialProps(props) {
        const { address } = props.query;
        return { address };
    }

    render() {
        return (
            <Layout>
               <Form>
                   <Form.Field>
                       <label>Description</label>
                   </Form.Field>
                   <Form.Field>
                       <label>Value (Ether)</label>
                   </Form.Field>
                   <Form.Field>
                       <label>Recipient Address</label>
                   </Form.Field>
               </Form>
            </Layout>
            
        );
    }
}

export default RequestNew;
