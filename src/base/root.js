import React from 'react';
import Nav from './nav';
import DocumentMeta from 'react-document-meta';
import './style.scss';
import Footer from './footer';

export default function Root(props) {
    const normalizedPath = props.path.replace("/","-");
    const meta = {
        ...props.meta,
        title: `Alon Bar David | ${props.meta.title}`
    }
    return (<div id={`page-${normalizedPath}`}>
        <Nav></Nav>
        <DocumentMeta {...meta} />
        <section id="main-content" className="container">
            {props.children}
        </section>
        <Footer>

        </Footer>
    </div>)
}