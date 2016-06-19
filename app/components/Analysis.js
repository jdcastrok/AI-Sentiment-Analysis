/**
 * Created by ajduran on 23/05/16.
 */
var React = require('react');
var CustomTextCollection= require('./CustomTextCollection');
var AddText = require('./AddText');

var Analize = React.createClass({
    getInitialState(){
        return{
            textCollection: []
        }
    },
    addText(newText){
        if (this.state.textCollection.indexOf(newText) != -1) {
            alert('That text has been already inserted!');
            return;
        }
        var newCollection = this.state.textCollection;
        newCollection.push(newText);
        this.setState({
            textCollection:  newCollection
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
                <h4>Texts to analize<a className="btn-floating btn-large waves-effect waves-light green right tooltipped" data-position="left" data-delay="50" data-tooltip="Analyze text to queue"><i className="material-icons">done</i></a></h4>
                <br/>
                <CustomTextCollection textCollection={this.state.textCollection} onClick={this.removeFromQueue}/>
                <AddText onClickAddTextButton={this.addText}/>
                <br/><br/>
            </div>

        );
    }

});

module.exports = Analize ;
