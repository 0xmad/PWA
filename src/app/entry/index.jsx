/* global module */
/* global process */
'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import runtime from 'serviceworker-webpack-plugin/lib/runtime';
import VideoItem from '../component/VideoItem/VideoItem';

ReactDOM.render(
  <VideoItem/>,
  document.getElementById('root')
);

function waitUntilInstalled(registration) {
  return new Promise(function (resolve, reject) {
    if (registration.installing) {
      registration.installing.addEventListener('statechange', (e) => {
        if (e.target.state === 'installed') {
          resolve();
        } else if (e.target.state === 'redundant') {
          reject();
        }
      });
    } else {
      resolve();
    }
  });
}

if ('serviceWorker' in navigator) {
  runtime.register()
    .then(waitUntilInstalled)
    .catch((error) => {
      throw error;
    });
}


if (module.hot && process.env.NODE_ENV !== 'prod') {
  module.hot.accept('../component/VideoItem/VideoItem', () => {
    ReactDOM.render(
      <VideoItem/>,
      document.getElementById('root')
    );
  });
}