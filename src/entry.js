import ReactDOM from 'react-dom';
import {getComponent,getOnPathLoadComponent,setRouteHandler,startRouting} from 'src/core/routing';
import MixPanel from 'src/core/mixpanel';
const MIXPANEL_API_TOKEN = process.env.NODE_ENV == 'production'?"99f090d64dfd7b5a03c6d2541720a2a4":"324d2a454057cf56355b8216463a29e8";
var firstRun = true;
var rootElem = document.getElementById('root');
var mixpanel = new MixPanel(MIXPANEL_API_TOKEN);
function renderComponent(Component){
    ReactDOM.render(
        Component,
        rootElem
    );
}
function render(path){
    mixpanel.trackEvent("page_view");
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