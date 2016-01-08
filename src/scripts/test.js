/**
 * Created by Vlad on 2015-10-22.
 */
var React = require('react');

var template = require('../compiledTemplates/test.rt')
    mod = React.createClass({
    render: template
});

module.exports = mod;