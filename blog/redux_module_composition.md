---
title: Redux module composition and how to avoid namespacing
description: A new way to manage and reuse redux packages
tags: javascript,redux, redux-blocks
createdAt: 2017-04-07
---
## Redux module composition and how to avoid namespacing

### Summary
Current solutions for composing and reusing _Redux_ code suffer from a lack of encapsulation - modules either require the user
to supply a path on the store or already hardcode the store's path.
Encapsulation, and therefor simple composition and reuse, can be achieved by function composition - this article explains how this works.

[Redux-blocks](https://github.com/alonbardavid/redux-blocks) is a library that implements the ideas presented here.


### Background

I love _Redux_ - it's simple, expressive and consistent but sometimes it feels like working with a huge
global state.
I believe the root cause for this is that the common and standard way of composing redux modules is by
namespacing - attaching a prefix to actions and states.
This breaks encapsulation - the module has to know where in the store it is positioned, and this directly affects how
selectors and actions work.
Some packages hardcode where in the path they exists while other packages let you override the namespace (like [redux-form](https://www.npmjs.com/package/redux-form)).
Either way this makes making and using reusable _Redux_ modules overly complicated and is inflexible.

Compounding on that problem is that most tutorials and examples structure code by function (I.E. top level folders for
reducers, actions, selectors, saga etc...) instead of by feature (I.E. each top level folder has it's own reducer.js,
actions.js etc...) , which means that a specific module's code is spread across files and directories.

### Current solutions

The current solutions to creating reusable _Redux_ modules fall into 3 types:

- The module prefix is hardcoded into every type, action and reducer (e.g. redux-form, react-redux-toastr)
- The module exposes a function that given a prefix returns already namespaced reducers and actions
- The module exposes a function that receives functions to get state and actions from the store
- The module includes a middleware that knows how to parse actions by certain conventions (e.g. redux-api-middleware)

In all of these solutions, action types are fixed and can't be changed - they differentiate using an action's payload
(e.g. redux-form uses the `form` property to know which form was used rather then an action's type being prefix with a
 form name)


What if we could write modules as if they were self contained, without knowledge of where they sit in the state, that
have their own private types and selectors?

So instead of doing something like this :
```js
    // some-redux-module.js
    const DO_STUFF="MODULEPREFIX_DO_STUFF"; //here's our namespacing

    export function doStuff(payload){
        return {
            type:DO_STUFF,
            payload
        }
    }
    export function reducer(state,action){
        switch(action.type){
            case DO_STUFF:
                return //some new state
            default:
                return state;
        }
    }
    export function selectStuff(state) {
        return state.moduleprefix.stuff;   //some more namespacing
    }

    //in reducer.js
    import {reducer} from 'some-redux-module'

    combineReducers({
        moduleprefix: reducer  //some more namespacing, but now by whomever is using our module
    })

```

we could do something like:
```js
    // some-redux-module.js
    const types = {
        DO_STUFF="DO_STUFF"
    }
    const actions = {
        doStuff: (payload)=>({
            type:DO_STUFF,
            payload
        })
    }
    const selectors = {
        selectStuff: (state)=>state.stuff
    }
    function reducer(state,action){
        switch(action.type){
            case DO_STUFF:
                return //some new state
            default:
                return state;
        }
    }

    export default {
        actions,
        types,
        selectors,
        reducer
    }

    //in reducer.js
    import SomeModule from 'some-redux-module'

    const PrefixedModule =mount('moduleprefix',SomeModule);

    createStore(PrefixedModule.reducer);
```

### Composing Redux modules by mounting

Redux's simplicity makes it trivial to create reusable components - reducers, actions and selectors are just
functions, and as functions they can be wrapped by other functions.
Instead of the user delegating the prefixing of the reducer to the module , we can instead isolate the module into
a state that only contains the state,action and types that the module needs.

#### Isolating a reducer
To isolate a reducer, we simply wrap it in function that sends it the nested state.

Instead of doing this:
```js
    function nestedReducer(state,action){
        switch (action.type){
            ...
            return newState
        }
    }
    const reducer = combineReducer({
        nested: nestedReducer
    })
```

we can do this:
```js
    function nestedReducer(state,action){
        switch (action.type){
            ...
            return newState
        }
    }
    const reducer = (state,action)=>{
        return {
            ...state,
            nested: nestedReducer(state.nested,action)
        }
    }
```

#### Isolating an action (and action type)
We can prefix a type with the same prefix we used to contain the reducer.

So instead of:
```js
    const DO_STUFF = "NESTED_DO_STUFF";

    export function doStuff(payload){
        return {
            type:DO_STUFF,
            payload
        }
    }
    bindActionCreators({doStuff});
```

we can do this:
```js
    const DO_STUFF = "DO_STUFF";

    export function doStuff(payload){
        return {
            type:DO_STUFF,
            payload
        }
    }
    //in some other file
    const mountedAction = function(payload){
        const result = doStuff(payload);
        return {
            type: "NESTED_" + result,
            ...result
        }
    }
    bindActionCreators({doStuff:mountedAction});
```

and if we combine these with the reducer, we can isolate both actions and reducer into a shared world:

```js
    const DO_STUFF = "DO_STUFF";

    function nestedReducer(state,action){
        switch (action.type){
            case DO_STUFF:
                return newState;
            default:
                return state;
        }
    }
    const reducer = (state,action)=>{
        const nestedAction = {
            ...action,
            type: "NESTED_" + action.type
        }
        return {
            ...state,
            nested: nestedReducer(state.nested,action)
        }
    }
```

#### Isolating selectors
Similarly to reducers, selectors simply need to be wrapped in a function that calls the selector with a reduced state.

```js
    const selectStuff = state=>state.stuff

    const nestedSelectStuff = state=>selectStuff(state.nested)

```


### Benefits of this approach

- Modules are self-contained and are easier to test - no need to pass a path variable around
- You can import Modules directly, without specifying actions/selector, or specifying a path prefix
- You can put the modules anywhere you want in your own state, and with any type
- You can use the same package more then once without specifying special variables
- State from modules don't have to be put in the root state
- Easy to work with a structure by feature approach

### A library to contain redux modules
Of course the point of this post is not to get you write more boilerplate code, so all of these techniques and some more
have been collected in an npm package - [redux-blocks](https://www.npmjs.com/package/redux-blocks)

### Handling redux-saga
The beauty of this approach really starts to shine when used along-side redux-saga , so that modules can not only provide their
own state management but can handle and react to actions - all while still contained within their own isolated world.

redux-saga however is a bit more complicated to work with, and I'll leave that to another post.