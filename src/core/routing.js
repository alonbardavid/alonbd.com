import React from 'react';
import crossroads from 'crossroads';
import metadata from '../metadata';
import Root from 'src/components/root/root';
import Loader from 'src/components/loader/loader';
import Post from 'src/components/post';

const pages = require.context('bundle-loader?lazy&name=[path][name]!src/pages',true,/.*/);

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
                        window.history.pushState(null,null,href);
                        try {
                            window.dispatchEvent(new Event('changestate'));
                            event.preventDefault();
                        } catch(e){
                            //revert to no ajax loading
                        }
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
    return <Root meta={metadata.pages[path]} path={path}>
        <div className="loaderPage"><Loader></Loader></div>
    </Root>
}
export function wrapComponent(Component,meta){
    if (meta.route.indexOf("/posts/") ==0){
        return <Post meta={meta}><Component meta={meta}/></Post>
    }
    return <Component meta={meta}/>
}
export function getComponent(path) {
    path = path.lastIndexOf("/") == path.length - 1? path.substr(0,path.length-1):path;
    return getPage(`./${path}`).then(args=>{
        const Component = args.default || args;
        const meta = metadata.pages[path];
        return <Root meta={meta} path={path}>
            {wrapComponent(Component,meta)}
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