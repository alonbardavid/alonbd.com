import ReactDOM from 'react-dom';
import {getComponent,getOnPathLoadComponent,setRouteHandler,startRouting} from './routing';

var lastComponent;
var rootElem = document.getElementById('root');
function renderComponent(Component){
    ReactDOM.render(
        Component,
        rootElem
    );
}
function render(path){
    let timeout = setTimeout(()=>{
        lastComponent && renderComponent(getOnPathLoadComponent(lastComponent,path));
    },100);
    return getComponent(path,lastComponent).then(result=>{
        clearTimeout(timeout);
        const {Component,toRender} = result;
        lastComponent = Component;
        renderComponent(toRender);
    })
}
setRouteHandler(render);
startRouting();