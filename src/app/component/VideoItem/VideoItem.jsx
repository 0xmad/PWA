'use strict';

import React from 'react';
import PropTypes from 'prop-types';

export default class VideoItem extends React.PureComponent {
  render() {
    const style = {
      margin: '0 0 1em 0',
      maxWidth: '100%',
      width: '480px',
    };
    return (
      <section>
        <video autoPlay muted loop style={style}>
          <source src="https://scontent.cdninstagram.com/t50.2886-16/15219754_184048185390174_375691810267201536_n.mp4" type="video/webm"/>
        </video>
      </section>
    );
  }
}