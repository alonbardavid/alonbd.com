import React from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';
import crossroads from 'crossroads';

let render = function(page){
    return ()=> page().then(({default:component})=>{
        ReactDOM.render(
            React.createElement(component),
            document.getElementById('root')
        );
    });
}
if (typeof document == 'undefined') {
    var currentPage = null;
    render = function (page){

        currentPage = page;
    }
    module.exports = function render(locals) {
        crossroads.parse(locals.path);
        return currentPage().then(({default:component})=>{
            return {
                root:ReactDOMServer.renderToString(React.createElement(component))
            };
        });
    };
}
crossroads.addRoute("/about",render(require('promise?global!./pages/about.js')));
crossroads.addRoute("/about2",render(require('promise?global!./pages/about2.js')));
crossroads.addRoute(":rest*:",render(require('promise?global!./pages/main.js')));


// Client render (optional):
if (typeof document !== 'undefined') {
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
    crossroads.parse(document.location.pathname + document.location.search)
}

