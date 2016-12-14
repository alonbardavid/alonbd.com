import ReactDOMServer from 'inferno-server';
import Helmet from 'react-helmet';
import crossroads from 'crossroads';
import {getComponent,setRouteHandler} from './routing';

var currentPath = null;
function setChosenPath(path){
    currentPath = path;
}
setRouteHandler(setChosenPath);
module.exports = function render(locals) {
    crossroads.parse(locals.path);
    return getComponent(currentPath).then(Component => {
        const root = ReactDOMServer.renderToString(Component);
        const head = Helmet.rewind();
        return {
            root,
            head: head.title.toString() + head.meta.toString()
        };
    })
};