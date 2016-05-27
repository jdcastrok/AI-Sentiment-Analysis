/**
 * Created by ajduran on 23/05/16.
 */
var React = require('react');
var AddText = require('./AddText');
var TextQueue= require('./TextQueue');

var Analize = React.createClass({
    getInitialState(){
        return{
            textCollection: []
        }
    },
    addText(newText){
        //thtis.state.textCollection.push(newText);
        //alert("Hello world!");
        if (this.state.textCollection.indexOf(newText) != -1) {
            alert('That text has been already inserted!');
            return;
        }
        var newCollection = this.state.textCollection;
        newCollection.push(newText);
        this.setState({
            textCollection:  newCollection,
            newText: ''
        });
    },
    removeFromQueue(textItemId){
        var tempCollection = this.state.textCollection;
        tempCollection.splice(textItemId, 1);
        this.setState({
            textCollection: tempCollection
        });
    },
    render(){
        return (
            <div>

                <TextQueue textCollection={this.state.textCollection} removeFromQueue={this.removeFromQueue}/>
                <AddText onClickAddTextButton={this.props.addText} />

            </div>

        );
    }

});

module.exports = Analize ;
