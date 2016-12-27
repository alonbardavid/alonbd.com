import React from 'react';
import avatar from '../../img/avatar.jpg';
import metadata from '../../metadata';
import './footer.scss';

export default function FooterComponent(){
    return <footer>
        <div className="container">
            <div className="footer-section footer-hello">
                <div className="avatar-container">
                    <img className="avatar" src={avatar} alt="Alon Bar David"></img>
                </div>
                <div >
                    <h2>HELLO!</h2>
                    <p>
                        My name is Alon Bar David.<br/>
                        I'm an independent consultant, web developer, software development enthusiast
                        and proud father of two.
                    </p>
                </div>
            </div>
            <div className="footer-section footer-links">
                <h2>AROUND THE WEB</h2>
                You can find me at the following places:
                <ul>
                    {metadata.aroundTheWeb.map((link,i)=>
                        <li key={i}><a className="link-primary" href={link.url} target="blank">{link.title}</a></li>
                    )}
                </ul>
            </div>
        </div>
    </footer>
}