import React from 'react';
import avatar from '../img/avatar.png';
import metadata from '../metadata';
import './footer.scss';

export default function(){
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
                        I'm a freelance fullstack developer.
                    </p>
                </div>
            </div>
            <div className="footer-section">
                <h2>AROUND THE WEB</h2>
                <p>
                    You can find me at the following places:
                    <ul>
                        {metadata.aroundTheWeb.map(link=>
                            <li><a href={link.url}>{link.title}</a></li>
                        )}
                    </ul>
                </p>
            </div>
        </div>
    </footer>
}