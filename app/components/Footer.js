var React = require('react');

var TextArea = React.createClass({

  getInitialState(){
    return {
    }
  },

  render(){

    return (
        <footer className="page-footer light-green">
          <div className="footer-copyright green">
            <div className="container">
            © 2016 Copyright 
            </div>
          </div>
        </footer>

    );
  }

});

module.exports = TextArea;
