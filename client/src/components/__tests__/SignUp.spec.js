import React from 'react';
import ReactDOM from 'react-dom';
import SignUp from '../SignUp';
import { BrowserRouter as Router } from 'react-router-dom';

describe('SignUp', () => {
  it('requires all fields', () => {
    const wrapper = mount(<Router><SignUp user={""}/></Router>)
    expect(wrapper.exists()).toBe(true)
    wrapper.find('input[name="fname"]').instance().value = 'New';
    wrapper.find('input[name="fname"]').simulate('change');
    wrapper.find('input[name="lname"]').instance().value = 'Name';
    wrapper.find('input[name="lname"]').simulate('change');
    wrapper.find('input[name="email"]').instance().value = 'new@new.com';
    wrapper.find('input[name="email"]').simulate('change');
    wrapper.find('input[name="password"]').instance().value = 'pass';
    wrapper.find('input[name="password"]').simulate('change');
    wrapper.find('input[name="verifyPassword"]').instance().value = 'word';
    wrapper.find('input[name="verifyPassword"]').simulate('change');
    expect(wrapper.find('input[name="fname"]').props().value).toEqual('New')
    wrapper.find('.user-signup-form').simulate('submit')
    expect(wrapper.find('.alert-message').exists()).toBe(true)
  })
})