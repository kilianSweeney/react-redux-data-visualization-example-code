import React from 'react';
import { connect } from 'react-redux';
import {ListGroup,ListGroupItem} from 'react-bootstrap';

import { dashboardActions } from '../_actions';

import '../styles/third-party.css';

class DashboardStats extends React.Component {
    componentDidMount() {
      this.props.dispatch(dashboardActions.getStats());
    }

    render() {
      const { stats } = this.props;
      return (
          <div className="EventSummary module-wrapper">
              <h3>At A Glance</h3>
            {stats &&
              <ListGroup componentClass="ul">
                <ListGroupItem><span className="pull-left">Events</span><span className="pull-right">{new Intl.NumberFormat().format(stats.events)}</span></ListGroupItem>
                <ListGroupItem><span className="pull-left">Attendees</span><span className="pull-right">{new Intl.NumberFormat().format(stats.attendees)}</span></ListGroupItem>
                <ListGroupItem><span className="pull-left">Event Revenue</span><span className="pull-right">&#36;{new Intl.NumberFormat().format(stats.eventRevenue)}</span></ListGroupItem>
                <ListGroupItem><span className="pull-left">Average Event ROI</span><span className="pull-right">{new Intl.NumberFormat().format(stats.averageEventROI)}</span></ListGroupItem>
                <ListGroupItem><span className="pull-left">Hashtag Reposts</span><span className="pull-right">&#36;{new Intl.NumberFormat().format(stats.hashtagReposts)}</span></ListGroupItem>
              </ListGroup>
            }
          </div>
      );
    }
}

function mapStateToProps(state) {
    const { stats } = state.dashboard;
    return {
        stats
      }
}

const connectedDashboardStats = connect(mapStateToProps)(DashboardStats);
export { connectedDashboardStats as DashboardStats };
