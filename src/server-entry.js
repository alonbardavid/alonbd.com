import ReactDOMServer from 'react-dom/server';
import DocumentHead from 'react-document-meta';
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
        return {
            root:ReactDOMServer.renderToString(Component),
            head: DocumentHead.renderAsHTML()
        };
    })
};