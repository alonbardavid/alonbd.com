import React from 'react';

export default class MainComponent extends  React.Component {
    state = {
        counter:0
    }
    render() {
        return <div>
            <button onClick={()=>this.setState({counter:this.state.counter+ 1})}>click me!</button>
            <div>Counter: {this.state.counter}</div>
            <div><a href="/about">go to about!</a></div>
        </div>
    }
}