import ReactDOM from 'react-dom';
import {getComponent,getOnPathLoadComponent,setRouteHandler,startRouting} from './routing';

var firstRun = true;
var rootElem = document.getElementById('root');
function renderComponent(Component){
    ReactDOM.render(
        Component,
        rootElem
    );
}
function render(path){
    var timeout;
    if (!firstRun) {
        timeout = setTimeout(()=> {
            renderComponent(getOnPathLoadComponent( path));
        }, 100);
    }
    return getComponent(path).then(Component=>{
        timeout && clearTimeout(timeout);
        firstRun = false;
        renderComponent(Component);
    })
}
setRouteHandler(render);
startRouting();