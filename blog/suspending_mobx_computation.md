---
title: Suspending mobx computation
description: Suspending mobx computation using mobx itself
tags: javascript,mobx
createdAt: 2019-08-26
---

## Suspending mobx computation

### Summary
With [_mobx_](https://mobx.js.org/) you can reevaluate expressions automatically when objects that
those expressions use change.    
This is _mobx_'s special sauce and what makes us love it, but sometimes
you want to suspend evaluations until something happens.  

 
The usual way to do it with _mobx_ is by subscribing/unsubscribing to changes, but that means
you have to manage these kind of state synchronization manually.   
Instead we can leverage _mobx_ itself to create a new decorator that can suspend evaluations
based on a provided variable.

### Background
In a recent project I was making a _react-native_ app that was working constantly in the background
to process bluetooth events. When the app was in the background we didn't want
to render anything to not overuse the battery.    
We were using _mobx_ extensively to drive the logic and views of the app and
didn't want to step outside it to manually manage what observers are allowed to run where.

What we really want is the ability to suspend a mobx computation or reaction based on another observable. 

### Building your own computed decorator

We can build our own `@computed` decorator that lets us suspend computations arbitrarily:

```js
import { computed} from 'mobx'

const suspended = observable.box(false)
export function setSuspended(value) {
  suspended.set(value)
}
export function suspendableComputed(
  instance: any,
  propertyName: PropertyKey,
  descriptor: PropertyDescriptor,
  ...args
) {
  let cached
  const oldDescriptor = descriptor.get
  descriptor.get = function() {
    if (!suspended.get()) {
      cached = oldDescriptor.apply(this)
    }
    return cached
  }
  return computed(instance, propertyName, descriptor, ...args)
}
```

so instead of _@computed_ you use _suspendableComputed_ and whenever you 
want to suspend all computation you simply call `setSuspended(true)` and 
anything calling the computed function will get a cached value.    
When you want to start evaluating again, you call `setSuspended(false)`
and the last change that should have triggered your _computed_ evaluation is
triggered again.

### Alternatives

#### Subscribing and unsubscribing on events
The usual way of handling such things is simply to stop observing values when you want 
to suspend evaluation. _mobx-react_ does it automatically when a component is
no longer rendered, but it can also be done manually.

#### Prioritized render
If the reason why you want to stop computation is because there are some things
that have a high priority to be shown right now and other computations might cause lag,
and if you are using react, than you can use the new fiber architecture to give your
different renders priority. 

Though it's still not a finished api, it's likely to be 
completed and release very soon. For more information you can look at the wonderful example
[here](https://philippspiess.com/scheduling-in-react/)


### A Library

While we were talking about _@computed_ suspending reactions is also possible
with a similar setup, though it's a bit more complicated.    
So for that case I've made a small library that adds suspension to both
computed and reaction in mobx - [mobx-suspend](https://www.npmjs.com/package/mobx-suspend)