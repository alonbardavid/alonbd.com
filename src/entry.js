import ReactDOM from 'react-dom';
import {getComponent,setRouteHandler,startRouting} from './routing';

function render(path){
    return getComponent(path).then(Component=>{
        ReactDOM.render(
            Component,
            document.getElementById('root')
        );
    })
}
setRouteHandler(render);
startRouting();