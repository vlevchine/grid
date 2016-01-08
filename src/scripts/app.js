/**
 * Created by Vlad on 2015-10-21.
 */
var React = require('react'),
    ReactDOM = require('react-dom');

var Test = require('./test'),
    elem = React.createElement(Test, null);
ReactDOM.render(elem, document.getElementById('app'));
var r = 0;