var React = require('react');
var NavBar = React.createClass({

	getInitialState(){
		console.log(this.props.logo);
		return {
			logo: this.props.logo,
			leftMenuItems: this.props.leftMenuItems, // Array de JONS con la cofiguración de los items del NavBar {}
			rightMenuItems: this.props.rightMenuItems // Array de JONS con la cofiguración de los items del NavBar {}
			}
	},

	render(){
		var leftMenuItems = this.state.leftMenuItems.map(function (menuItem) {
	      		return <li key={menuItem.id}><a href={menuItem.link}>{menuItem.text}</a></li>;
	      	});
		var rightMenuItems = this.state.rightMenuItems.map(function (menuItem) {
	      		return <li key={menuItem.id}><a href={menuItem.link}>{menuItem.text}</a></li>;
	      	});
		return (
			<nav>
			    <div className="nav-wrapper green">
			      <a href={this.state.logo.link} className="brand-logo center">{this.state.logo.text}</a>
			      <ul id="nav-mobile" className="left hide-on-small-only">{leftMenuItems}</ul>
			      <ul id="nav-mobile" className="right hide-on-small-only">{rightMenuItems}</ul>
			    </div>
			  </nav>

		);
	}

});

module.exports = NavBar;
