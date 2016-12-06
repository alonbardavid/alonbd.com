import React from 'react';

export default function(){
    return <section className="menu">
        <h1 className="title"><a href="/">Alon Bar David</a></h1>
        <nav role="navigation">
            <a className="nav-item" href="/projects">Projects</a>
            <a className="nav-item" href="/blog">Blog</a>
            <a className="nav-item" href="mailto:me@alonbardavid.com">Contact</a>
            <a className="nav-item" href="/about">About</a>
        </nav>
    </section>
}