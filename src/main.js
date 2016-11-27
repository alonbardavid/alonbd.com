import React from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';
import crossroads from 'crossroads';
import Main from './pages/main';
import About from './pages/about';
import About2 from './pages/about2';

let render = function(component){
    return function() {
        ReactDOM.render(
            component,
            document.getElementById('root')
        );
    };
}
if (typeof document == 'undefined') {
    var currentComponent = null;
    render = function (component){
        
        currentComponent = component;
    }
    module.exports = function render(locals) {
        crossroads.parse(locals.path);
        return {
            root:ReactDOMServer.renderToString(currentComponent)
        };
    };
}
crossroads.addRoute("/about",render(<About></About>));
crossroads.addRoute("/about2",render(<About2></About2>));
crossroads.addRoute(":rest*:",render(<Main></Main>));


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

