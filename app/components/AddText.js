var React = require('react');
var TextArea = require('./TextArea');

var AddText = React.createClass({
  getInitialState(){
      return{
        newText: this.props.text
      }
  },
  handleTextChange(changedText){
      this.setState({
        newText: changedText
      });
  },
  handleClickAddButton(){
      this.props.onClickAddTextButton(this.state.newText);
      this.setState({
        newText: ''
      });
  },
  render(){
	return (
		<div>
                    <ul className="collection">
                        <li  className="collection-item avatar">
                            <h4>Insert Text</h4>
                        </li>
                        <li  className="collection-item avatar">
                            <TextArea text={this.state.newText} onChange={this.handleTextChange}/>
                            <a className="btn-floating btn-large waves-effect waves-light green right tooltipped" data-position="left" data-delay="50" data-tooltip="Add text to queue" onClick={this.handleClickAddButton}><i className="material-icons">add</i></a>
                             <br></br><br></br><br></br>
                        </li>
                      </ul>
                    
                   
          </div>

	);
  }

});

module.exports = AddText;
