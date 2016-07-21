import React from 'react';

const Beta = () => (
  <div className="beta model-backdrop">
    <div className="text-wrap">
      <h1><i className="material-icons left">warning</i>Beta</h1>
      <p>
        This application is not finalized and may change at any moment!
        It only serves for demonstration & testing purposes.
        Because of that, there is no public registration, yet. If you want to try the app out,
        you can <a href="mailto:shoetten[ät]uos[dot]de" title="Email">drop me a line</a> or
        ask an already registered friend to send you an invite link.
      </p>
      <p>
        If you find an error or think the app should behave differently in some way,
        you could do me a huge favor
        with <a href="mailto:shoetten[ät]uos[dot]de" title="Email">writing me</a> about
        it. Thanks!
      </p>
    </div>
  </div>
);

export default Beta;
