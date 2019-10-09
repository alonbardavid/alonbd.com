---
title: Why you should use MobX
description: An list of advantages of MobX over different state management solutions 
tags: programming, mobx, redux, react
createdAt: 2019-10-09
---
# Why you should use MobX
## A comparison of state management solutions for react
<img class="cover" src="./images/why-you-should-use-mobx-cover.png"
    alt="mobx on superman" />
    
I've used various state management libraries over the years (with react and not) but for the past few years MobX is my go
to solution for everything - from simple toy apps to complicated 
apps built by multiple teams, I'm even using it in frameworks that
aren't react (Vue.js).   

__Why am I using it so often?__ I'll try and answer that by listing
MobX's advantages and comparing each advantage to what I think are
failings of alternative solutions (Since this is geared more 
towards react users, I'll compare it to redux and state management
using context)

This article assumes you are familiar with MobX and how it works
if you aren't, you should read the [MobX documentation](https://mobx.js.org/README.html#introduction).

## Advantages of MobX

### MobX has minimal boilerplate

Redux is notorious for it's boilerplate. Here's a simple api call recipe in redux, something
every app has in one form or another:
```js
// in actions.js
// these are action creators
export const  requestResource= (resourceId)=>({
  type: 'REQUEST_RESOURCE',
  resourceId
})
export const requestResourceSuccess = (resourceId,payload)=>({
  type: 'REQUEST_RESOURCE_SUCCESS',
  resourceId,
  payload
})
export const requestResourceFailure = (resourceId,error)=>({
  type: 'REQUEST_RESOURCE_FAILURE',
  resourceId,
  error
})
export const fetchResource = resourceId => dispatch =>{
  dispatch(requestResource(resourceId));
  return fetch(`url/resource/${resourceId}`)
    .then(response=>response.json())
    .then(json=>dispatch(requestResourceSuccess(resourceId,json)))
    .catch(e=>dispatch(requestResourceFailure(resourceId,e)))
}

// in reducers.js
export default (state = {}, action) => {
  switch (action.type) {
    case 'REQUEST_RESOURCE':
        return {
            resources:{
                ...state.resources,
                [action.resourceId]: {loading:true}
            }
        }
    case 'REQUEST_RESOURCE_SUCCESS':
        return {
            resources:{
                ...state.resources,
                [action.resourceId]: {loading:false,resource:action.payload}
            }
        }
    case 'REQUEST_RESOURCE_FAILURE':
        return {
            resources:{
                ...state,
                [action.resourceId]: {loading:false,error:action.error}
            }
        }
    default:
      return state
  }
}
```

That's a lot of code to do something very simple, and that's before 
we've added the minimal libraries to make redux usable in non-trivial
applications - _redux-thunk_/_redux-saga_ , _reselect_ (for momoization) 
and _normalizr_ (for normalization).

In contrast a MobX store that does the same would be written like this:

```js
class ResourceStore {
  @observable
  resources = {};
 
  @action("REQUEST_RESOURCE")
  requestResource(id) {
    this.resources[id] = {loading:true};
    return fetch(`url/resource/${id}`)
        .then(response=>response.json())
        .then(action("REQUEST_RESOURCE_SUCCESS",
              resource=>{this.resources[id] = {loading:false,resource};}))
        .catch(action("REQUEST_RESOURCE_FAILURE",
              error=>{this.resources[id] = {loading:false,error};}))
  }
}
    
```

And for those who are wondering that is exactly the same functionality
as the previous _redux_ example. Beyond being more concise it's also
much clearer and direct, there's nowhere for extra functionality to
creep up at you.

Unlike the _redux_ example it automatically memoizes and there's no
need for _thunk_ or _saga_ to work in a real app. (It doesn't normalizes
though, that takes a bit more work to do)

There are various attempts to reduce the boilerplate - from redux
itself, such as the _actionCreatorCreator_ (I cringe just hearing
that name) to full-fledged conventional libraries like _ducks_.
Unfortunately they either didn't live up to their claims or haven't
gained much popularity.

The extreme amount of boilerplate code isn't limited to the logic layer
part of creating _redux_ reducers. It's also added to the consumer part -
react components:
```js
//resource-view.js
function ResourceView(props) {
  const {loading,resource,error} = props;
  return loading? <loader/>:<ResourceItem resource={resource}/>
}

const mapStateToProps = (state,ownProps) => ({
    ...state.resources[ownProps.resourceId]
})
export default connect(mapStateToProps)(ResourceView)

// resource-list.js
function ResourceList(props) {
  const resourceIds = [1,2,3,4,5,6,7,8]; //Just for example sake, this would usually be taken from the store as well
  const {requestResource,resources} = props;
  return <div>
    {resourceIds.map(id=><div key={id}>
      {resources[id]?<ResourceView resourceId={id} />:
      <button onClick={()=>requestResource(id)}>load</button>}
    </div>)}
  </div>
}
const mapStateToProps = (state,ownProps) => ({
    resources:state.resources
})
const mapDispatchToProps = (dispatch,ownProps) =>({
    requestResource:()=>requestResource(ownProps.resourceId)(dispatch)
})
export default connect(mapStateToProps,mapDispatchToProps)(ResourceView)

```

Another option for state management in React is to use the 
Context api.

Let's make the same api example with Context and Hooks:

```js
const ResourceContext = React.createContext();
function useResource(){
  const [resource,setResource] = React.useState({});
  return {
    resource,
    requestResource(){
      setResource({loading:true});
      return fetch(`url/resource/${resourceId}`)
        .then(response=>response.json())
        .then(json=>setResource({loading:false,resource:json}))
        .catch(error=>setResource({loading:false,error}))
    }
  }
}

function resourceProvider(){
  const value = useResource();
  return <ResourceContext.Provider value={value} >
    {children}
  </ResourceContext.Provider>
}
```

That's not too different from the _MobX_ example - we only
add  `createContext` and `Context.Provider`. However we need
to use `Context.Provider` and `useContext` every time we want
state that needs to be used separately.    
The more your application grows and state moves up the tree the 
more this becomes a common occurrence until your top level component
looks something like this:
```js
  function App(){
    return <PostsContext.Provider>
            <NotificationsContext.Provider>
              <AuthenticationContext.Provider>
                ... ad nauseum 
              </AuthenticationContext.Provider>
            </NotificationsContext.Provider>
          </PostsContext.Provider>      
  }
```   

If you follow Kent C. Dodds' guidelines on how to build state, you'll
probably say that this shouldn't happen because state should only be
as close to the usage as possible and not all of it should stay at
the top.    

Unfortunately I find that a lot of common use cases require state to be hoisted to the top
of the app - anything that needs to be shown in 2 sections of the app 
(such as in the main window and the sidebar, or navbar), for example:
notifications/messages , authentication (and my user info), showing 
if a feed/group has more items to show, number of online users and
a lot more.

Since you often bundle state and actions together with MobX it also
lessons the problem of prop drilling - it's much easier to send a
single prop down several level than multiple ones, which makes your
lower level components simpler.

### MobX always renders the minimal required components

Out of the box, and with little effort, MobX will rerender only components
whose render tree will actually change when you update a specific
part of the store.
That means that MobX will never render a component unless the props
it depended on changed; it'll never render the parent of the component that actually
changes or it's siblings .

To get similar functionality with redux you need to use the difficult
and very manual process of memoization.    
Let's take our resource api example from the previous point.

```js
//resource-view.js
function ResourceView(props) {
  const {loading,resource,error} = props;
  return loading? <loader/>:<ResourceItem resource={resource}/>
}

const mapStateToProps = (state,ownProps) => ({
    ...state.resources[ownProps.resourceId]
})
export default connect(mapStateToProps)(ResourceView)

// resource-list.js
function ResourceList(props) {
  const resourceIds = [1,2,3,4,5,6,7,8]; //Just for example sake, this would usually be taken from the store as well
  const {requestResource,resources} = props;
  return <div>
    {resourceIds.map(id=><div key={id}>
      {resources[id]?<ResourceView resourceId={id} />:
      <button onClick={()=>requestResource(id)}>load</button>}
    </div>)}
  </div>
}
const mapStateToProps = (state,ownProps) => ({
    resources:state.resources
})
const mapDispatchToProps = (dispatch,ownProps) =>({
    requestResource:()=>requestResource(ownProps.resourceId)(dispatch)
})
export default connect(mapStateToProps,mapDispatchToProps)(ResourceView)

```

If we use redux naively all  _ResourceView_ components will rerender
every time any _resource_ in the store changes.

To change it to be more performant we need to use memoization.    
Let's change the code to use the _reselect_ library:

``` js
// resource-view.js

const resourceById = createSelector([
    (state,props)=>state.resources[props.resourceId]
],(resource)=>resource)
const mapStateToProps = (state,ownProps) => ({
    ...resourceById(state,ownProps)
})
```

This is more boilerplate, but beyond that it is hard to work with
it - you need to manually consider what permutations of state
need to rerender your component and take them all into account.    
If your components are slightly more complex it also becomes a
nightmare to maintain and extend (usually this will be the case
for top level components such as pages or navigations)

Using context for state management suffers similar problems, if you
wanted to only render the `ResourceView` when the actual resource
changes, you'll have to create a `Context` for each resourceId (or
alternatively restructure your app in some way).

Even if you did all that though there are still edge-case that only
MobX can deal with.    
Consider a situation where you want to count the second since
your fetch was called inside a resource property that is updated 
while something is loading and show how long the request took 
when it's done.

```js
const ResourceContext = React.createContext();
function useResource(){
  const [resource,setResource] = React.useState({});
  return {
    resource,
    requestResource(){
      const interval = setInterval(()=>({
        // this is a contrived example for brevity, I know it's not
        // how you'll do it and that it won't work since resource is
        // always the original value
        setResource({...resource,seconds:resource.time + 1 })
      }),1000)
      setResource({loading:true,seconds:0});
      return fetch(`url/resource/${resourceId}`)
        .then(response=>response.json())
        .then(json=>setResource({...resource,loading:false,resource:json}))
        .catch(error=>setResource({loading:false,error}))
        .finally(()=>clearInterval(interval))
    }
  }
}

//resource-view.js
function ResourceView(props) {
  return props.loading? <Loader/>:<ResourceItem resource={props.resource}/>
}
```

Now every second `ResourceView` rerenders even though we are only
showing the `<Loader/>` component and nothing actually changes.   
Reselect and Context are simply unable to determine that as long
as the _loading_ property is true no other property of resource is
being used.

Mobx however will by default not rerender _ResourceView_ until
the loading property is changed - because MobX only renders based
on what properties were used in the last render.

__Note:__ this characteristic of MobX depends on referencing the
observable at the bottom most components and for every component
to use observer (both are the natural way to use MobX in React).    
If you reference an observable value at the top of your app and
send that value as a prop throughout the render tree, everything
will render on every change. (so don't do that)

### MobX doesn't require you to change your code

Using MobX looks just like normal javascript, it doesn't require
you to change your code or architecture to support it (unlike Redux
and to a lesser extent Context).

In fact it's such an invisible abstraction that in many cases if you
take out all of the MobX code - the _@observable_, _@computed_, _@action_ and
_observer_ decorators, your code will work exactly the same (though
it'll have some performance issues).

In it's core MobX isn't a state management solution at all, it's
a meta-programming approach to increase performance - as such it
is utterly unopinionated about how you structure your code.    
The state management part is what you build with it.     
Some will consider that a drawback, but I like my frameworks and
libraries to be as unopinionated as possible so I can structure
my code the way I think is best.
  
### MobX is easily composable 

One of the biggest problems with redux, at least for me, is that
because of it's global nature it's hard to compose it (and 
composeReducers is definitely not the kind of composing I mean).

The main reason why redux has problems with composability
is that the path within the store in redux matters. With the standard
way of using _redux_ you can't use the same component for a reducer
module that sits under `authentication/user/current` and 
`groups/user/manager` even if the store itself is exactly the same.    
If you use the `connect` function you'll need to use different HOCs
for the same component or create a component that accepts the path
of the store as a property.

That's why normalization is such a big factor in Redux - if you 
always put all of the same objects in the same location you don't
get this problem.    
But this means that every reducer that needs to display a shared
object needs access to the pool of shared resources - for instance
every api call for a store that loads a user needs access to the
shared user store.    

This breaks the ability of modules to be self-contained but it
isn't too bad for most apps, the problem really lies when starting
to use third-party components.    
Since third-party components and modules can't predict how your 
store will look they can't take benefit of your store without some
terrible shenanigans. That's one of the reasons why redux doesn't 
have a lot of popular user modules/libraries (like simple REST
consumers for instance) but does have a lot of middlewares.

For a great example why redux makes composable utility libraries hard
look at redux-forms - whenever you create or use an instance of _redux-form_
you must give it the path in the store (and it has to be top level in the 
reducer as well)

### Logic shouldn't be part of the view layer
I started doing web UI before the proliferation of the 
single-page-application and just like now there were a lot of
competing ideas and frameworks. The one thing they all agreed on 
though is that your view layer should never contain logic 
(whether you called the objects in that layer controllers, DAOs 
or fat models).

Perhaps I'm old fashioned but I still can't bear to see logic 
inside the view layers - and in React that means inside a component.

There are good reason why you shouldn't put logic inside your view
layer:

* __It makes it harder to refactor__ - if your components know your
store's structure (which is what happens with _connect_ in redux)
than any refactor that changes the structure requires you to change
the view layer. It also ties your app's logic to how your view is 
structured - which is a problem if you have different type of views
to the same model.

* __It's harder to maintain and reason about an app's flow if
the view is in charge of it__ - If your components call apis then
to know if an action would result in an api call you have to follow
the lifecycle and rendering of your render tree. When your logic
is detached from the view the result of actions are much more
deterministic and aren't tied to what page you are viewing or what
components are currently showing

* __It makes testing slower and more complex__ - If your view is
responsible for calling apis and performing business logic it means
that you need to initiate the view (in this case React's rendering)
in order to test an app's flow. If your logic isn't connected to the
view than testing it is usually as simple as testing a regular 
javascript function.

 * __Cross-cutting concerns are harder to use__ - things like
 logging, caching and error handling are much harder to do when
 they are split between multiple components. 
 
 These problems are also relevant if you use _react-mobx_'s inject
 to extract state from store inside components.
  
### MobX isn't limited to global state
 
Not everything should sit in the logic layer. Things that are
local to a component or that aren't shared between far away
components shouldn't be kept in side the component's state.    
Forms are an example of something that should probably be local
to your component (unless it's persisted between sessions).

 
The same benefits of using MobX for a global state, namely performance
and lack of boilerplate, can be achieved when using MobX inside your
component.

Let's take a simple form example using hooks:
 
 ```js
class Form {
  @observable
  email = ""
  @observable
  password = ""
  
  @computed
  get emailError(){
    if (this.email && this.email.length >0 &&
        this.email.indexOf("@") >= 0){
        return "email must contain @ character"
    }
    return null
  }
  @computed
  get passwordError(){
    if (this.password && this.password.length >0 &&
       this.password.length < 8){
       return "password must have 8 characters"
    }
    return null 
  }
  @computed
  get valid(){
    return this.email && !this.emailError &&
      this.password && !this.passwordError
  }
  
  @action
  setEmail(event){
    this.email = event.target.value;
  }
  
  @action
  setPassword(event){
    this.password=event.target.value;
  }

}

return function FormView(props){
  const {submitForm} = props;
  const form = useMemo(()=>new Form(),[true]);
  return <form onSubmit={()=>form.valid && submitForm(form)}>
    <input name="email" value={form.email} 
      onChange={form.setEmail} />
    {form.emailError && <div>{form.emailError}</div>}
    <input name="password" value={form.password} 
      onChange={form.setPassword} type="password"/>
    {form.passwordError && <div>{form.passwordError}</div>}
  </form>
}
``` 

## Drawbacks

### MobX doesn't work well with immutability

Relying extensively on mutation to figure out what needs to be
recalculated, MobX doesn't work well with immutability.    
It's not that immutability doesn't work, simply that if you use
immutability often you'll lose the performance benefits that MobX
provides, and with that there's not much to gain by using it.

### MobX is harder to track and debug

Since MobX uses "magic" , A.K.A. meta-programming, to keep track
of what observables are being used and subscribed to it hides a lot
of it's implementation from the normal debugging and programming tools.

Debugging becomes a bit of an issue when you want to realize what
caused something to recalculate/rerender and what will rerender if
you change something. That's the most powerful feature of redux -
all of the boilerplate is for the benefit of keeping the app flow
understandable and maintainable.    
With very large apps and with multiple developers working on the same
app MobX can grow hard to maintain and strict conventions need to be
develop to keep the state and app flow manageable.

Redux's ability to rewind time and keeping track of state changes
is also a very strong tool for maintaining and debugging code, which
MobX can't really do (if you use actions and strict mode you'll get
an approximation of it, which is good, but not close enough).

The [MobX state tree](https://github.com/mobxjs/mobx-state-tree) 
attempts to fix some of these pain points, but at the cost of being
very opinionated and losing a lot of the flexibility to draws people
into using MobX.  
