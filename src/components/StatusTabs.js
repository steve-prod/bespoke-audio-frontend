import React, { Component } from 'react';
import {
  Col,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane
} from 'reactstrap';
import classnames from 'classnames';
import PrivateTab from './PrivateTab.js';
import PublicTab from './PublicTab.js';

export default class StatusTabs extends Component {
      constructor(props) {
          super(props);
          this.toggle = this.toggle.bind(this);
          this.handleNeedsRefreshChange = this.handleNeedsRefreshChange.bind(this);
          this.handleStatusTabChange = this.handleStatusTabChange.bind(this);
          this.handleRecipientChange = this.handleRecipientChange.bind(this);
      }

      handleRecipientChange(recipient) {
          this.props.onRecipientChange(recipient);
      }

      handleStatusTabChange(tab) {
          this.props.onStatusTabChange(tab);
      }

      handleNeedsRefreshChange() {
          this.props.onNeedsRefreshChange();
      }

      toggle(tab) {
          this.handleStatusTabChange(tab);
      }

      componentDidMount() {

      }

  render() {
    return (
      <div>
         <Nav tabs>
           <NavItem>
             <NavLink
               className={classnames({ active: this.props.statusTab === 'private-tab' })}
               onClick={() => { this.toggle('private-tab'); }}
             >
               Private
             </NavLink>
           </NavItem>
           <NavItem>
             <NavLink
               className={classnames({ active: this.props.statusTab === 'public-tab' })}
               onClick={() => { this.toggle('public-tab'); }}
             >
               Public
             </NavLink>
           </NavItem>
         </Nav>
         <TabContent activeTab={this.props.statusTab}>
           <TabPane tabId="private-tab">
             <Row>
               <Col sm="12">
                   <PrivateTab
                       isLoaded={this.props.isLoaded}
                       recorder={this.props.recorder}
                       onNeedsRefreshChange={this.handleNeedsRefreshChange}
                       recipient={this.props.recipient}
                       onRecipientChange={this.handleRecipientChange}
                   />
               </Col>
             </Row>
           </TabPane>
           <TabPane tabId="public-tab">
             <Row>
               <Col sm="12">
                   <PublicTab
                       isLoaded={this.props.isLoaded}
                       recorder={this.props.recorder}
                       onNeedsRefreshChange={this.handleNeedsRefreshChange}
                   />
               </Col>
             </Row>
           </TabPane>
         </TabContent>
       </div>
    );
  }
}
