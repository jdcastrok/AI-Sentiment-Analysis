var React = require('react');

var TextArea = React.createClass({

  getInitialState(){
    return {
    }
  },

  render(){

    return (
        <div className="row" >
          <form className="col s12">
            <div className="row">
              <div className="input-field col s12">
              <i className="material-icons prefix">edit_mode</i>
                <textarea id="textarea1" className="materialize-textarea"></textarea>
                <label htmlFor="textarea1">Text to analyze</label>
              </div>
            </div>
          </form>
        </div>

    );
  }

});

module.exports = TextArea;
