import React from 'react';
import crossroads from 'crossroads';
import metadata from './metadata';
import Root from './base/root';
import Index from './pages/index';
import Loader from './base/loader';

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
        });
        document.addEventListener('click',(event)=>{
            var node = event.target;
            while(node){
                if (node.tagName == 'A') {
                    var href = node.href;
                    if (href.indexOf(window.location.origin) ==0){
                        event.preventDefault();
                        window.history.pushState(null,null,href);
                        window.dispatchEvent(new Event('changestate'));
                    }
                    return;
                }
                node = node.parentElement;
            }
        })
    }
}
if (typeof document !== 'undefined') {
    overrideLinkAction();
}
export function getOnPathLoadComponent(path){
    if (/\/$/.test(path)) {
        path = path.substr(0,path.length - 1);
    }
    return <Root meta={metadata.pages[path]} path={path}>
        <div className="loaderPage"><Loader></Loader></div>
    </Root>
}
export function getComponent(path) {
    if (/\/$/.test(path)) {
        path = path.substr(0,path.length - 1);
    }
    return getPage(`./${path}`).then(args=>{
        const Component = args.default || args;

        return <Root meta={metadata.pages[path]} path={path}>
            <Component></Component>
        </Root>
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