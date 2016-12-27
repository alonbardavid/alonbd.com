import Core from 'FLIP/src/core';
import RAF from 'FLIP/src/raf';
import last from 'lodash/last';
Core.extend('rAF',RAF);

export default Core;

function bindOnce(element,action,func){
    const bounded = function(){
        element.removeEventListener(action,bounded,false);
        func();
    }
    element.addEventListener(action,bounded,false)
}
export function flipGroup(elements,action) {
    const flip = new Core.group(elements);
    flip.first();
    action();
    flip.last();
    flip.invert();
    flip.play();
    return new Promise(resolve=>{
        bindOnce(last(elements).element,'flipComplete',resolve)
    });
}
