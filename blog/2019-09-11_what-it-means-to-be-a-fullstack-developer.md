---
title: What it means to be a full stack developer
description: Why you can also do full stack development and what are the benefits 
tags: Full-Stack,full stack
createdAt: 2019-09-11
---
## What it means to be a full stack developer  
<img class="cover" src="./images/what-it-means-to-be-fullstack-cover.png"
    alt="Tetris bricks making a stack" />
  
Lately when I talk about full stack development a lot of people proclaim
their skepticism on the subject - saying that full stack engineers don't
exist or that most developers, if not all, are only suitable for either
back-end or front-end work.

The criticism mostly boils down to two issues:

* No one can be an expert at both front-end and back-end, so it's better to
  specialize 
* Most people are only suitable for either front-end or back-end work.

These critiques miss the entire point of what full stack is.

### Full stack isn't about code, it's about _ownership_.

Full stack isn't about what languages you know or what technologies you
mastered: it's about having the tools  and authority to deal with a task
from start to finish, and getting rid of obstructions. 
   
Splitting a single task into different responsibilities and handing 
them to different people creates unnecessary detachment, adds superfluous 
coordination, and often can prevent simple cross-layer solutions.   

Let's consider a common web development task that requires a simple
new API from a back-end developer and a bit more work front the front-end
developer - for example, showing a graph of some new metric or activity.

The timeline for development of such a feature often looks like this:

<img alt="back-end-front-end-timeline" 
    src="./images/what-it-means-to-be-fullstack-timeline.png" 
    style="width:80%;margin-left: auto;margin-right: auto;display: block;" />

When scope changes or new knowledge about the task comes to light, 
adjustments need to be made to the original architecture, and one 
developer becomes a bottleneck for the other - preventing continuous
work, adding pressure to each side and causing painful context switches,
that can sometimes lead to resentment and conflict.

Since most work is sequential in nature (in the illustrated example the
front-end dev requires the API to work) until a prerequisite task is done,
one of the developers must wait or rely on workarounds (in the 
illustrated case - using a mock API).
 
And above all, many times a difficult problem in one layer has a simple
solution in a different layer. And when a developer is just front-end or 
just back-end, they often ignore solutions to business issues 
from outside their own domain.

### Advantages of doing full stack development

* **No bottlenecks** - not having to wait for another person before you
can continue working.
* **Faster iteration** - the ability to change the API and see the results
in the client, change the UI and see how it handles the new API and doing
so continuously..
* **Visibility to and from stakeholders** - showing progress
and communicating using the visual part of the application helps to both
connect and relate to stakeholders.
* **Ownership** - Becoming a single point of contact for interested parties (
stakeholders, QA, Product, Management) makes communication and 
management easier and provides a sense of responsibility.

### Anyone can do full stack

To answer the criticism that not everyone can do full stack, I'd like to
point out, that what we consider front-end was back-end just a few years 
ago, especially the hard parts - routing, state management, caching, 
even business logic is now done routinely on the front-end.   

Most front-end issues don't require detailed knowledge of 
design languages, UI performance or browser compatibilities - it's usually
just adding a few divs and changing some CSS values (assuming your client
is web-based).   

Similarly most back-end issues don't require detailed knowledge
of concurrence models, bytecode manipulation or ORM internals - it's
usually just adding a new field to the database or API model.

Being a full stack engineer doesn't mean being an expert in all things, it doesn't
mean doing everything on your own. Owning and developing a feature in
an area you are less strong at, doesn't mean you can't get help; you 
should definitely ask for guidance and instructions from those, who
are more experienced and specialize in that area.    

### You can still specialize while doing full stack

Being full stack doesn't mean you can't specialize or become an expert
on a topic.    

Frankly saying that one can't master both front-end and
back-end implies that if you concentrate on just one layer you can 
master it. That is absurd, there are so many areas in front-end
and back-end that it is impossible for anyone to be an expert in all
aspects of development in a layer.

You can be a full stack developer and be an expert in using graphing libraries.     
You can be a full stack developer and be an expert in using ORMs.

Just like any other developer, a full stack will eventually develop 
expertise in certain areas, so it's natural to assign the more complex
tasks in those areas to developers who specialize in them.

> _Don't split your developers into layers_

### Full stack is more than just back-end and front-end

Full stack isn't just about back-end or front-end, full stack is a 
way of working where a developer owns his code and can remove
all obstacles to complete a task on his own.

The same way of working applies to the entire stack - a back-end 
developer shouldn't have to wait for a DBA to approve an SQL script
on a database, or for DevOps to add his feature to the CI. When doing
front-end work, you shouldn't wait for a UI designer to crop an
image for you.

### Full stack always applicable 

Like all things in software development, no process is a silver 
bullet. People have been splitting development into 
different layers for years, and there is value in it. 
    
If your development process involves a lot of planning and your 
specifications are air-tight, there are benefits to having different 
people doing different layers.    

Some industries have hefty regulations or certification process that 
makes doing full stack development in all teams troublesome.

Full stack also doesn't have to exist in the entire organization, 
however if you are doing web development with agile processes you will
probably gain a lot by moving to a more full stack oriented process.

#### Footnotes

Since this article is probably going to be a contentious with a lot of
people I'll try and head off a few critiques:

* While a lot of the examples in this article focuses on front-end, the
benefits of full stack development don't just make front-end work easier.
back-end development also suffers from the same issues and enjoys
the same benefits. 
* You might get the impression from this article that you should never
split your tasks. That's not at all what I'm getting at - you should
really split your tasks into manageable stories - but split them by
feature and function, not into layers.
