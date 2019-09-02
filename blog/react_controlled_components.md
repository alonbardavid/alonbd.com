---
title: Controlled components are awesome - and we don't talk about it enough
description: Controlled components are a powerful and simple concept that is often neglected
tags: javascript,react,components,ui
createdAt: 2019-09-02
---
## Controlled components are awesome - and we don't talk about it enough  

### Summary

Controlled components, a term popularized by React, are simply components who derive their entire state from properties given to it rather than by keeping internal data.
I think it is one of the most important ingredients in making a maintainable UI and it isn’t talked about enough outside of the React community (perhaps not enough in it as well).
Controlled components make tests easier, provide customizability with little extra effort and are inherently composable.

### What are Controlled Components

**A controlled component is just a component whose state is managed by it's parent rather then internally.**
That's a simple idea but it really changes how you approach creating components.

------------

To make this article as framework agnostic as possible we'll try to make
our own simple input component with pure javascript - it takes a selector that
shows where to insert the component in the DOM, a label, a value and a callback
to notify when an input changed.    
This is how components in _React_, _Vue_, _Angular_ and any other SPA 
framework eventually simplify into. 

So let's consider a simple uncontrolled component
````js
function myComponent(selector,label,value,onChange){
  let element = document.querySelector(selector);
  element.innerHTML=```
    <div class="my-element">
        <label>${label}</label>
        <input></input>
    </div>
  ```
  let input = element.querySelector('input'); 
  input.value = value;
  input.addEventListener('input', onChange);
}
````

A similar controlled component would be written as :
````js
function myComponent(selector,label,value,onChange){
  let element = document.querySelector(selector);
  element.innerHTML=```
    <div class="my-element">
        <label>${label}</label>
        <input></input>
    </div>
  ```
  let input = element.querySelector('input'); 
  input.value = value;
  input.addEventListener('keydown', e=>{
      e.preventDefault(); //stops the input from accepting the change
      input.value = onChange(input.value + e.key);
  });
}
````

So now instead of updating the model inside the component and notifying the parent after the fact,
the component doesn't update the model at all. **Instead the component cedes control of its state to
its parent, who can handle the value however it likes.**

This trivial example seems like a lot of extra work for no benefit - we just
added extra steps to do the same thing.
 
### Why use controlled components

What using a controlled component gives us is the ability to change the component's
internal state in any way we want.

For example consider what happens if we want to prevent the user from
changing input when invalid characters are added.    
In the uncontrolled component example, we need to handle every different type of validation internally -
so if we want pattern validation, we need to add that separately than maximum length.     
If we do it naively it’ll look something like this:
````js
function myComponent(selector,label,value,onChange,validations = {}){
  let element = document.querySelector(selector);
  element.innerHTML=```
    <div class="my-element">
        <label>${label}</label>
        <input></input>
    </div>
  ```
  let input = element.querySelector('input'); 
  input.value = value;
  input.addEventListener('input', e=>{ 
    let raw = e.target.value;
    if (validations.maxLength && raw.length > validations.maxLength
      || validations.pattern && validations.pattern.test(raw)){
      // for simplicity we are going to assume input events are cancelable
      e.preventDefault();
    } else {
      onChange(raw);
    }
  });
}
````

With a controlled component the component’s implementation doesn’t need to change, since the parent
is the one to decide which values are ok to let pass and which aren’t.   
Now, of course, most frameworks without controlled components don’t do this but rather provide a
generic implementation of validator functions that you can write on your own – a function that
 takes the value and returns true or false.

But this is a single solution to a single symptom solved by controlled components. 

Let’s look at a different example - what if you wanted to format the input as 
someone inputs values, let's say we wanted to add a thousand separator for numbers.   

With our uncontrolled component example, we'll do something like this: 
````js
function myComponent(selector,label,value,onChange,validations = {},format=null){
  let element = document.querySelector(selector);
  element.innerHTML=```
    <div class="my-element">
        <label>${label}</label>
        <input></input>
    </div>
  ```
  let input = element.querySelector('input'); 
  input.value = value;
  input.addEventListener('input', e=>{
    let raw = e.target.value;
    if (validations.maxLength && raw.length > validations.maxLength
      || validations.pattern && validations.pattern.test(raw)){
      // for simplicity we are going to assume input events are cancelable
      e.preventDefault();
    } else {
      if (format) {
        raw = format(raw);
        input.value = raw;
      }   
      onChange(raw);
    }
  });
}
````

While our uncontrolled component example gets more and more complicated, our
original controlled component example can handle everything without changing.

**Controlled components gives us a lot of versatility with little effort**.     
In this way the caller, who has a better understanding of higher level
concerns, can handle the business logic while our component can stay lean
and handle the low level aspects of interacting with the DOM.

### Components make testing easy

Testing UI (in this case the DOM) is complex and time consuming.    
To illustrate, consider a simple test for our previous uncontrolled 
component - we want to test a maxLength validation of 1.

````js
test('when maxLength is 1, input should reject any keypress',()=>{
  //assuming we have a div in our test environment with the id #test-app
  const onChangeCalls = [];
  myComponent("#test-app","my-label","A",{maxLength:1},(value)=>calls.push(value));
  const input = document.querySelector("#test-app input");
  //this test is a simplified version, to really simulate an input event, you'll need to
  //change the target value, call more events and react like the browser.
  input.dispatchEvent(new Event('keypress',{bubbles:true,cancelable:true,key:"B"}))
  expect(calls.length).toEqual(0);
  expect(input.value).toEqual("A");
})
````

Not only do you need to spin up an entire browser (or at least a 
mock dom environment like jsdom), you need to constantly make complex,
error-prone and time consuming dom calls such as querySelector and 
triggerEvent, and you also need to know the internals of how the component
works - in this case that it has a single input. (These need to be done even if you use testing utilities 
that wrap these actions for you).

You need to do this for each variation of your inputs (patterns could have
dozens of examples to verify validity).    

For a controlled component on the other hand you can easily separate 
the tests into 2 - testing that the component properly updates based on
changes that are provided to it, and once you trust that your component
acts as it should with input, you can just test `onChange` function - 
no need to start a browser session, or get into dom internals.

**Controlled components define a strict barrier between the component's 
responsibility and the caller's.** In turn it removes the need to test all
permutations of a component features and let's you test the component
and business logic separably. 

### Tradeoffs
Of course, there are no free lunches in programming and controlled components come with a cost –
they have more boilerplate. Since uncontrolled components handle their own state, you don’t need
code to handle state in your parent. For simple use cases, which are the usually the majority in
every app, this becomes tedious and unproductive.

They also prevent the component from utilizing native apis to the maximum - 
consider our original example of validating illegal input for _length_ and
_pattern_ .    
The HTMLInput element already has builtin apis for these kind of validations
and they might even provide additional advantages (for example on mobile if
you provide a certain pattern to input validations, you can get a different
keyboard)

The example would be written like this instead:
````js
function myComponent(selector,label,value,onChange,validations = {}){
  let element = document.querySelector(selector);
  element.innerHTML=```
    <div class="my-element">
        <label>${label}</label>
        <input></input>
    </div>
  ```
  let input = element.querySelector('input'); 
  input.value = value;
  if (validations.maxLength) {
    input.maxLength = validations.maxLength;
  } 
  if (validations.pattern){
    input.pattern = pattern;
  }
  input.addEventListener('input',onChange);
}
````

Is it worth it then? My experience says, yes. There is always that little feature, that use case,
that doesn’t fit into the available customization for a component and often the effort of syncing
state for such a use case overshadows repeating the boilerplate for using controlled components.
Your miles may vary though.

### Controlled components aren't limited to forms  

Most articles about controlled/uncontrolled components (including this one) 
revolve around form inputs, but anything that reacts to changes can be
a controlled component.    
Some examples are collapsables/accordions, lists, tables and anything that
is interactive really.