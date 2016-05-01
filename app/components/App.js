var React = require('react');
var Navbar = require('./Navbar');
var AddText = require('./AddText');
var TextQueue = require('./TextQueue');
var Footer = require('./Footer');


var App = React.createClass({
	/*
	getInitialState(){
		return {
			
			}
		};
	},
	*/
	render(){
		var logo = {text: "X²ntiment Analysis", link: "#"},
		       leftMenuItems =  [{text: "Analysis", link: "#", id: 0}, 
		       		      {text: "About", link: "#", id: 1}, 
		       		      {text: "link3", link: "#", id: 2}],
		 	rightMenuItems =  [{text: "Login", link: "#", id: 0}],
		 	textCollection = [
		 		{
		 			text: "asdaasdasdasdasdasdasd"
		 		},
		 		{
		 			text: "daddmokasda121afs21a2sddadd m okasda121afs21a2sddaddmokasda121afs21a2sddaddmokasda121afs21a2sddaddmokasda121afs21a2sddaddmokasda121afs21a2sddaddmokasda121afs21a2sddaddmokasda121afs21a2sddaddmokasda121afs21a2sddaddmokasda121afs21a2sdd addmokasda121afs21a2sddaddmokasda121afs21a2 sddaddmokasda121afs21a2s ddad dmokasda121afs21a2sddaddmokasda121afs21a2sddaddmokasda121afs21a2sddaddmokas da121afs21a2sddaddmokasda121afs 21a2sddaddmokasda121afs21a2sddaddmokasda121afs21a2sddaddmokasda121afs21 a2sddaddmokasda121afs21a 2sddaddmokasda121a fs21a2sddaddm okasda121afs21a2sddaddmokasda121afs21a2sddaddmokasda121afs21a2s ddaddmokasda121afs21a2sddaddmokasda121afs21a2sddaddmokasda121afs21a2sddaddmokasda121afs21a2sddaddmokasda121afs21a2sddaddmo kasda121afs21a2sddaddmo kasda121af s21a2sddaddmokasda121afs21a2sddaddmokasda121afs21a2sddaddmokasda121afs21a2sddaddmokasda121afs21a2 sd daddmokasda121afs21a2sddaddmokasda121afs21a2sddaddmokasda121afs21a2sddaddmokasda121afs21a2sddaddmokasda121afs21a2sddadd mokasda121afs21a2sddaddmokasd a121afs21a2sddaddmokasda121afs21a2sddaddmokasda121afs21a2sddaddmokasda121afs21a2sddaddmokasda121afs21a2sddaddmokasda121afs21a2sddaddmokasda121afs21a2sddaddmokasda121afs21a2sddaddmokasda121afs21a2sd daddmokasda121afs21a2sddaddmokasda121afs21a2sddaddmokasda121afs21a2sddaddmokasda121afs21a2sddaddmokasda1 21afs21a2sddaddmokasda121afs21a2sddaddmokasda121afs21a2sddaddmokasda121afs21a2sddaddmokasda121afs21a2sddaddmokasda121afs21a2 sddaddmokasda121afs21a2sddaddmokasda121afs21a2sddaddmokasda121afs21a2sddaddmokasda121afs21a2sddaddmokasda121afs21a2sddaddmokasda121afs21a2sddaddmokasda121afs21a2sddaddmokasda121afs21a2sddaddmokasda121afs21a2sddaddm okasda121afs21a2sddaddmokasda121afs21a2sddaddmokasda121afs21a2sddaddmokasda121afs21a2sddaddmokasda121afs21a2sddaddmokasda121afs21a2sddaddmokasda121afs21a2sddaddmokasda121afs21a2sddaddmokasda121afs21a2sddaddmokasda121afs21a2sddaddmokasda121afs21a2sddaddmokasda121afs21a2sddaddmokasda121afs21a2sd"
		 		}
		 	];

		return (
			<div>
				<Navbar  logo = {logo} leftMenuItems= {leftMenuItems} rightMenuItems= {rightMenuItems}/>
				<AddText />
				<TextQueue textCollection={textCollection}/>
				<Footer />
			</div>

		);
	}

});

module.exports = App;