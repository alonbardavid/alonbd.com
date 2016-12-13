import React from 'react';
import 'FLIP/dist/flip';
import ReactDOM from 'react-dom';

export default class PageTransition extends React.Component {

    componentWillReceiveProps(newProps){
        this.setState({Prev: this.props.children});
    }
    componentDidUpdate(){
        const wrapperNode = ReactDOM.findDOMNode(this);
        if (wrapperNode.childNodes.length > 1) {
            window.scroll(0,0);
            const prevNode = wrapperNode.childNodes[0];
            const currentNode = wrapperNode.childNodes[1];
            let i = 0;

            const flip = new window.FLIP.group([
                ...Array.prototype.map.call(prevNode.childNodes, elem=>({
                    element: elem,
                    duration: 20,
                    delay: i++ * 20
                })),
                {element:prevNode,duration:20,delay:i*20},
                ...Array.prototype.map.call(currentNode.childNodes, elem=>({
                    element: elem,
                    duration: 20,
                    delay: i++ * 20 + 100
                }))
            ]);
            prevNode.classList.add('page-transition-out-start');
            currentNode.classList.add('page-transition-in-start');
            flip.first();
            prevNode.classList.remove('page-transition-out-start');
            prevNode.classList.add('page-transition-out-end');
            currentNode.classList.remove('page-transition-in-start');
            currentNode.style["min-height"] = `${prevNode.clientHeight}px`;
            flip.last();
            flip.invert();
            flip.play();
            const onFlipComplete = (event) => {
                if (event.target == prevNode) {
                    currentNode.style["min-height"] = "";
                    prevNode.classList.remove('page-transition-out-end');
                    prevNode.removeEventListener('flipComplete', onFlipComplete);
                    this.setState({Current: this.state.Current, Prev: null});
                }
            }
            prevNode.addEventListener('flipComplete', onFlipComplete);
        }
    }
    render(){
        const {Prev} = this.state;
        return <div id="page-transition-container">
            {Prev && Prev}
            {this.props.children}
        </div>;
    }
}