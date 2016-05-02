
var React = require('react');

var CustomTextCollectionItem = React.createClass({

  handleClick(){
     this.props.onClick(this.props.itemId);
  },

  render(){
  	       var liClassName = "collection-item avatar",
                    iClassName = "circle light-green",
                    aClassName = "secondary-content",
                    a_iClassName = "material-icons tooltipped",
                    a_iDataPosition = "bottom",
                    a_idataDelay = "50",
                    a_idataTooltip = "Remove from queue",
                    a_iIconName = "delete";
		return (
                   <li className={liClassName}  >
          			     <i className={iClassName}>{this.props.itemId + 1}</i>
          			     <p>{this.props.text}</p>
          	      	            <a href="#!" onClick={this.handleClick} className={aClassName} ><i className={a_iClassName} data-position={a_iDataPosition} data-delay={a_idataDelay} data-tooltip={a_idataTooltip}>{a_iIconName}</i></a>
    	             </li>);
  }

});

module.exports = CustomTextCollectionItem;
