import React from 'react';
import crossroads from 'crossroads';
import metadata from './metadata';
import Root from './base/root';

const pages = require.context('bundle-loader?lazy&name=[path][name]!./pages',true,/.*/);

function getPage(path){
    return new Promise(function(resolve){
        pages(path)(resolve);
    });
}
function overrideLinkAction(){
    if (window.History) {
        window.addEventListener('popstate', () =>{
            window.dispatchEvent(new Event('changestate'));
        });
        window.addEventListener('changestate',()=>{
            crossroads.parse(document.location.pathname + document.location.search);
        })
        document.addEventListener('click',(event)=>{
            if (event.target.tagName.toLowerCase() == 'a') {
                event.preventDefault();
                window.history.pushState(null,null,event.target.href);
                window.dispatchEvent(new Event('changestate'));
            }
        })
    }
}
if (typeof document !== 'undefined') {
    overrideLinkAction();
}
export function getComponent(path) {
    return getPage(`./${path}`).then(args=>{
        const Component = args.default || args;
        return <Root meta={metadata.pages[path]}><Component></Component></Root>;
    });
}
export function setRouteHandler(render){
    crossroads.addRoute("/",render.bind(this,"index"));
    crossroads.addRoute("/{path*}",render);
}
export function startRouting(){
    if (typeof document !== 'undefined') {
        crossroads.parse(document.location.pathname + document.location.search)
    }
}