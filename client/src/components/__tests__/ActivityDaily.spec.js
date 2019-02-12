import React from 'react';
import ReactDOM from 'react-dom';
import ActivityDaily from '../ActivityDaily';
import { BrowserRouter as Router } from 'react-router-dom';

const activity = [{_id:
  "5c22f7b9aed28c019d66e44b", activityType: "Academics", date: "2018-12-25T00:00:00.000Z", description: "Math Class", time: 1.25}]


describe('ActivityDaily', () => {
  it('shows loaded activities', () => {
    const wrapper = shallow(<ActivityDaily dailyActivities={activity} />)
    expect(wrapper.find('td').first().text()).toEqual('Math Class')
  })
})
