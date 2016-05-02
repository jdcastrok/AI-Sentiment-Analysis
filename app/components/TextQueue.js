var React = require('react');
var CustomTextCollection= require('./CustomTextCollection');

var TextQueue = React.createClass({
  getInitialState(){
  	return{
  		textCollection: this.props.textCollection
  	}
  },
  removeFromQueue(textItemId){
  	var tempCollection = this.state.textCollection;
  	tempCollection.splice(textItemId, 1);
	this.setState({
		textCollection: tempCollection
		
	});
		

 },
 analyzeText(){
 	
 },
  render(){
	return (
		<div>
			<ul className="collection">
		 		<li  className="collection-item avatar">
		  			
		  			<h4>Text Queue <a className="btn-floating btn-large waves-effect waves-light green right tooltipped" data-position="left" data-delay="50" data-tooltip="Analyze text to queue"><i className="material-icons">done</i></a></h4>
		  			<br></br>
			    	</li>
			    	<li className="collection-item avatar">
			    		<CustomTextCollection textCollection={this.state.textCollection} onClick={this.removeFromQueue}/>
			    	</li>
			</ul>
			
			
		</div>

	);
  }

});

module.exports = TextQueue ;
