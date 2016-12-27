import React from 'react';
import ReactDOM from 'react-dom';
import Logo from '../../img/logo.svg';
import FLIP,{flipGroup} from 'src/core/flip';

import './nav.scss';
export default class NavComponent extends React.Component {

    componentWillReceiveProps (newProps){
        if (this.props.path != newProps.path &&
            this.props.path == 'index' || newProps.path == 'index'){
            const node = ReactDOM.findDOMNode(this);
            flipGroup([
                {element: node.querySelector(".logo"), duration: 300}
            ],()=>{
                if (this.props.path == 'index') {
                    node.classList.remove('full-screen');
                } else {
                    node.classList.add('full-screen');
                }
            })
        }
    }
    render(){
        var className = `menu ${this.props.path == 'index'?'full-screen':''}`;
        return <section className={className}>
            <h1 className="logo"><a href="/" dangerouslySetInnerHTML={{__html:Logo}} aria-label="Alon BD - Code/Design/Ops"></a></h1>
            <nav role="navigation">
                <ul>
                    <li>
                        <a className="nav-item nav-color-primary"  id="nav-projects" href="/projects">PROJECTS</a>
                    </li>
                    <li>
                        <a className="nav-item nav-color-two" id="nav-blog" href="/blog">BLOG</a>
                    </li>
                    <li>
                        <a className="nav-item nav-color-three" href="mailto:me@alonbardavid.com">CONTACT</a>
                    </li>
                </ul>
            </nav>
        </section>
    }
}
