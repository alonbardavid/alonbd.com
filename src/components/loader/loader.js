import React from 'react';
import LogoSmall from '../../img/logo-small.svg';
import './loader.scss';
export default function LoaderComponent(){
    return <div className="loader" aria-label="loading" dangerouslySetInnerHTML={{__html:LogoSmall}} >
    </div>
}