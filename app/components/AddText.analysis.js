var React = require('react');
var TextArea = require('./TextArea');

var AddText = React.createClass({
  getInitialState(){
      return{
        text: ""
      }
  },
  handleTextChange(newText){
      this.setState({
          text: newText
      });
  },
  handleClickAddButton(){
      if (this.state.text == ""){// validar que sea una expresión válida
        return;
      }
      this.props.onClickAddTextButton(this.state.text);
  },
  render(){
	return (
        <div  className="collection-item avatar" >
            <TextArea onChange={this.handleTextChange}/>
            <a className="btn-floating btn-large waves-effect waves-light green right tooltipped" data-position="left" data-delay="50" data-tooltip="Add text to queue" onClick={this.handleClickAddButton}><i className="material-icons">add</i></a>
        </div>

	);
  }

});

module.exports = AddText;
