import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';
import Navigation from '../navigation';

const {describe, it} = global;

describe('core.components.navigation', () => {
  it('should contain a link to home', () => {
    const el = shallow(<Navigation />);
    const homeLink = el.find('a').at(0);
    expect(homeLink.prop('href')).to.be.equal('/');
  });

  it('should contain a link to login when logged out', () => {
    const el = shallow(<Navigation />);
    const loginLink = el.find('.right a').at(0);
    expect(loginLink.prop('href')).to.be.equal('/login');
  });
});
