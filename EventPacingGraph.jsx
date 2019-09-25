import React from 'react';
import {Line} from 'react-chartjs-2';
import { connect } from 'react-redux';
import moment from 'moment';

import '../styles/list.css';

class EventPacingGraph extends React.Component {

  parseData(data) {
    if(data){
      const startDate = new Date(data.targetDate);

      const registrationChartData = [[], [], []],
        chartLabels = [];
      let tmpArr;

      data.values.forEach(element => {
        tmpArr = [];
        element.values.forEach(e2 =>{
          tmpArr.push(e2);
        });
        tmpArr.sort(function(a,b){
          return a.interval - b.interval;
        });
        tmpArr.forEach(e3 =>{
          const dataPoint = e3,
          index = Math.abs(parseInt(dataPoint.interval));
          
          registrationChartData[0].push(dataPoint.referenceValue);
          registrationChartData[1].push(dataPoint.value);
          registrationChartData[2].push(dataPoint.crossEventValue);
          chartLabels.push(index);
        });
      });
      
      const chartData = {
          datasets: [
            {label: 'Target', data: registrationChartData[0], borderColor: '#c6424f'},
            {label: 'Actual', data: registrationChartData[1], borderColor: '#bbd85f'},
            {label: 'Historical', data: registrationChartData[2], borderColor: '#40bbcc'}
          ],
          labels: chartLabels
      };
      return chartData;
    }
  }

  getOptions(data) {
      if(data){
      const startDate = new Date(data.targetDate);
      return {
        legend: {
            display: true,
            position: 'right',
            fullWidth: false,
            labels: {
                boxWidth: 15
            }
        },
        tooltips: {
          callbacks: {
              title: function(itemArr,data){
                  return itemArr[0].xLabel  +
                      ' (' + moment(startDate).subtract(itemArr[0].xLabel,'week').format('MM/DD/YYYY') + ')';
              },
              label: function(tooltipItem, data){
                  return '$' + tooltipItem.yLabel.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
              }
          }
        },
        scales: {
            yAxes: [{
                ticks: {
                    callback: function(value, index, values) {
                        return value + '';
                    }
                }
            }]
        }
      }
    }
  }

  componentDidMount() {

  }

  render() {
    const { eventPacing } = this.props;
    const { loadingEventPacing } = this.props;

    return (
        <div className="EventPacingGraph module-wrapper">
          <h3 style={{marginBottom:30}}>Pacing/Weeks Out</h3>
            {loadingEventPacing 
                && <em>Loading Pacing Data...</em>}
            {!loadingEventPacing 
                && eventPacing
                && Object.keys(eventPacing.values).length === 0
                && <em>No Data</em>}
            {!loadingEventPacing 
                && eventPacing
                && Object.keys(eventPacing.values).length !== 0 
                && <Line options={this.getOptions(eventPacing)} data={this.parseData(eventPacing)} />}
        </div>
    );
  }
}

function mapStateToProps(state) {
  const { eventPacing } = state.briefs;
  const { loadingEventPacing } = state.briefs;
    return {
        eventPacing, loadingEventPacing
      }
}

const connectedGraph = connect(mapStateToProps)(EventPacingGraph);
export { connectedGraph as EventPacingGraph };
