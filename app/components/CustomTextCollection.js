
var React = require('react'),
CustomTextCollectionItem = require('./CustomTextCollectionItem');

var CustomTextCollection = React.createClass({

  getInitialState(){
    return {
    	textCollection: this.props.textCollection
    }
  },

  render(){
            var self = this;
  	     var textItems = this.state.textCollection.map(function (textItem) {
                var itemId = self.state.textCollection.indexOf(textItem);
  		    return (<CustomTextCollectionItem key={itemId} text = {textItem} itemId ={itemId} onClick={self.props.onClick} />)
  	});
	return (
		<ul className="collection ">
		 	{textItems}
		</ul>

	);
  }

});

module.exports = CustomTextCollection;
