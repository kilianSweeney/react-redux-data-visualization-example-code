import React from 'react';
import {Line} from 'react-chartjs-2';
import { connect } from 'react-redux';
import { dashboardActions } from '../_actions';

import '../styles/list.css';

class DashboardScoreGraph extends React.Component {

    parseExperienceScoreData(averageScores) {
        const engagementScores = [],
        experienceScores = [],
        focusScores = [],
        sentimentScores = [],
        chartLabels = [],
        chartData = [],
        chartDatasets = [],
        dynamicColors = function(isOpaque) {
            const r = Math.floor(Math.random() * 255),
            g = Math.floor(Math.random() * 255),
            b = Math.floor(Math.random() * 255),
            opacity = isOpaque ? ",1)" : ",0.3)";
            return "rgb(" + r + "," + g + "," + b + opacity;
        };
        averageScores.map(function(item,i){
          const stageMarker = 0;

            switch(item.eventStage) { 
              case "LIVE": { 
                 stageMarker = 2;
                 break; 
              } 
              case "APPROVED": { 
                 stageMarker = 0;
                 break; 
              }
              case "INMARKET": { 
                 stageMarker = 1;
                 break;    
              } 
              case "POSTEVENT": { 
                 stageMarker = 3;
                 break;              
              } 
            } 
            chartLabels[stageMarker] = item.eventStage;
            engagementScores[stageMarker] = item.engagementScore ;
            experienceScores[stageMarker] = item.experienceScore;
            focusScores[stageMarker] = item.focusScore;
            sentimentScores[stageMarker] = item.sentimentScore;
            return null;
        });

        const labels = ['Experience', 'Engagement', "Focus", "Sentiment"];

        chartData.push([experienceScores,labels[0]]);
        chartData.push([engagementScores,labels[1]]);
        chartData.push([focusScores,labels[2]]);
        chartData.push([sentimentScores,labels[3]]);

        chartData.map(function(item,i){
          chartDatasets.push({
            label:item[1],
            data: item[0],
            fill: true,
            backgroundColor: dynamicColors(),
            borderColor: dynamicColors()
          });
            return null;
        });

        return {
          labels: chartLabels,
          datasets: chartDatasets
        };
    }

    componentDidMount() {
      this.props.dispatch(dashboardActions.getScores());
    }

    render() {
      const { scores } = this.props;
      return (
          <div className="DashboardScoreGraph module-wrapper">
          <h3 style={{marginBottom:30}}>Experience Scores</h3>
          {scores &&
            <Line data={this.parseExperienceScoreData(scores)} />
          }
          </div>
      );
    }
}

function mapStateToProps(state) {
    const { scores } = state.dashboard;
    return {
        scores
      }
}

const connectedDashboardScoreGraph = connect(mapStateToProps)(DashboardScoreGraph);
export { connectedDashboardScoreGraph as DashboardScoreGraph };
