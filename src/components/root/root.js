import React from 'react';
import Nav from 'src/components/nav/nav';
import Helmet from 'react-helmet';
import Footer from 'src/components/footer/footer';
import PageTransition from 'src/components/page-transition';
import LogoUrl from 'src/img/logo.png';
import './root.scss';

export default class RootComponent extends React.Component {

    render() {
        const props = this.props;
        const normalizedPath = props.path.replace("/","-");
        const title = `Alon Bar David | ${props.meta.title}`;
        const meta = {
            ...props.meta,
            title: title,
            meta: (props.meta.meta || []).concat([
                {name: "og:description", content: props.meta.description},
                {name:"og:title", content:title},
                {name:"og:image", content:LogoUrl}
            ])
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