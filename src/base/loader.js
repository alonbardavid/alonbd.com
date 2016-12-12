import React from 'react';
import LogoSmall from '../img/logo-small.svg';
import './loader.scss';
export default function LoaderComponent(){
    return <div className="loader">
        <img src={LogoSmall} className="rotating-logo" alt="loading"></img>
    </div>
}