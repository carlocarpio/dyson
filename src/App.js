import React, { Component } from 'react';
import _ from 'lodash';
import XMLParser from 'react-xml-parser';
import BubbleChart from './components/BubbleChart';
import Bubbles from './components/Bubbles';
import YearsTitles from './components/YearsTitles';
import GroupingPicker from './components/GroupingPicker';
import { createNodes } from './utils';
import { width, height, center, yearCenters } from './constants';
import * as d3 from 'd3';
import './App.css';

const xmlData = `
  <?xml version='1.0' encoding='utf-8'?>
  <Config name="Aha">
    <Config name="Database">
      <Config name="unknown"></Config>
    </Config>
    <Config name="user"></Config>
  </Config>
`;


class App extends Component {
  constructor(props) {
    super(props);
    const name = [];
    this.state = {
      expectedData: name,
      data: [],
      grouping: 'all',
    }
  }

  componentDidMount() {
    this.question1(xmlData, 'Config');
    d3.csv('data/gates_money.csv', (err, data) => {
      if (err) {
        console.log(err)
        return
      }
      this.setState({
        data: createNodes(data),
      })
    })
  }

  question1 = (data, tag) => {
    const xml = new XMLParser().parseFromString(data); 
    const xmlTag = xml.getElementsByTagName(tag);
    _.map(xmlTag, item => {
      item.attributes.name[0] === 'u' &&
        this.state.expectedData.push(item.attributes.name);
    });
  }

  onGroupingChanged = (newGrouping) => {
    this.setState({
      grouping: newGrouping,
    })
  }

  render() {
    const { data, grouping } = this.state
    return (
      <div className="App">
        <div style={{ textAlign: 'left' }}>
          <h4 style={{ paddingLeft: 20 }}>Question #1</h4>
          <div>
            <ul>
            {_.map(this.state.expectedData, item => (
              <li>{item}</li>
            ))}
            </ul>
          </div>
        </div>
        
        <div>
          <h4>Question #2</h4>
          <GroupingPicker onChanged={this.onGroupingChanged} active={grouping} />
          <BubbleChart width={width} height={height}>
            <Bubbles data={data} forceStrength={0.03} center={center} yearCenters={yearCenters} groupByYear={grouping === 'year'} />
            {
              grouping === 'year' &&
              <YearsTitles width={width} yearCenters={yearCenters} />
            }
          </BubbleChart>
        </div>
      </div>
    );
  }
}

export default App;
