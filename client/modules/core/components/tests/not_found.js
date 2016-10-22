import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';
import NotFound from '../not_found';

const {describe, it} = global;

describe('core.components.not_found', () => {
  it('should contain a link to home', () => {
    const el = shallow(<NotFound />);
    const homeLink = el.find('a').at(0);
    expect(homeLink.prop('href')).to.be.equal('/');
  });
});
