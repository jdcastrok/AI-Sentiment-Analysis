
var React = require('react');

var CustomTextCollection = React.createClass({

  getInitialState(){
    return {
    	textCollection: this.props.textCollection
    }
  },

  render(){
  	var textItems = this.state.textCollection.map(function (textItem) {
  		return (<li key={textItem.text} className="collection-item avatar">
  			<i className="circle light-green">1</i>
  			<p>{textItem.text}</p>
		      	<a href="#!" className="secondary-content"><i className="material-icons tooltipped" data-position="bottom" data-delay="50" data-tooltip="Remove from queue">delete</i></a>
	    	</li>)
  	});
	return (
		<ul className="collection ">
		 	{textItems}
		</ul>

	);
  }

});

module.exports = CustomTextCollection;
