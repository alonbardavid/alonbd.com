import React from 'react';
import Nav from './nav';
import Helmet from 'react-helmet';
import './style.scss';
import Footer from './footer';
import PageTransition from './page-transition';

export default class RootComponent extends React.Component {

    render() {
        const props = this.props;
        const normalizedPath = props.path.replace("/","-");
        const meta = {
            ...props.meta,
            title: `Alon Bar David | ${props.meta.title}`
        }
        return (<div id={`page-${normalizedPath}`}>
            <Nav path={props.path}></Nav>
            <Helmet {...meta} />
            <section id="main-content" className="container">
                <PageTransition>
                    {props.children}
                </PageTransition>
            </section>
            <Footer>
            </Footer>
        </div>)
    }
}