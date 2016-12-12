import React from 'react';
import ReactDOM from 'react-dom';
import Logo from '../img/logo.svg';
import 'FLIP/dist/flip';

import './nav.scss';
export default class NavComponent extends React.Component {

    componentWillReceiveProps (newProps){
        if (this.props.path != newProps.path){
            if (this.props.path == 'index') {
                const node = ReactDOM.findDOMNode(this);
                const flip = new window.FLIP.group([
                    {element: node.querySelector(".logo"), duration: 300}
                ]);
                flip.first();
                node.classList.remove('full-screen');
                flip.last();
                flip.invert();
                flip.play();
            } else if (newProps.path == 'index'){
                const node = ReactDOM.findDOMNode(this);
                const flip = new window.FLIP.group([
                    {element: node.querySelector(".logo"), duration: 300}
                ]);
                flip.first();
                node.classList.add('full-screen');
                flip.last();
                flip.invert();
                flip.play();
            }
        }
    }
    render(){
        var className = `menu ${this.props.path == 'index'?'full-screen':''}`;
        return <section className={className}>
            <h1 className="logo"><a href="/"><img src={Logo} alt="Alon BD - Code/Design/Ops"/></a></h1>
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
                    <li>
                        <a className="nav-item nav-color-three" href="/about">ABOUT</a>
                    </li>
                </ul>
            </nav>
        </section>
    }
}
