var metadata =module.exports = {
    getPosts:function(){
        return Object.keys(metadata.pages).filter(function(p){
            return p.indexOf("posts/") ==0;
        }).map(function(p){
            return metadata.pages[p];
        }).sort((a,b)=>a.publishDate < b.publishDate)
    },
    pages: {
        "posts/multiple_sites_with_mvc_5":{
            "title":"Multiple sites with MVC5",
            "description":"A simple way to work with multiple whitelabel sites in ASP.net",
            "tags":[".net","MVC","C#","Entity Framework","ASP","Programming"],
            "route":"/posts/multiple_sites_with_mvc_5",
            "publishDate":"2017-01-03T12:00:00.000Z"
        },
        "posts/redux_module_composition": {
            "title":"Redux module composition and how to avoid namespacing",
            "description":"A new way to manage and reuse redux packages",
            "tags":["javascript","redux","redux-blocks"],
            "route":"/posts/redux_module_composition",
            "publishDate":"2017-04-07T12:00:00.000Z"
        },
        "contact":{
            "title":"contact info",
            "route":"/contact"
        },
        "blog":{
            "title":"Blog",
            "route":"/blog"
        },
        "projects":{
            "title":"Projects",
            "route":"/projects"
        },
        "index": {
            "title":"",
            route:""
        }
    },
    aroundTheWeb: [
        {
            title:"GitHub",
            url:"https://github.com/alonbardavid"
        },
        {
            title:"Twitter",
            url:"https://twitter.com/alonbardavid"
        },
        {
            title:"Stackoverflow",
            url:"https://stackoverflow.com/users/1764456/alon-bar-david"
        }
    ],
    projects: [
        {
            title:"redux-blocks",
            description:"Authentication and Authorization framework for angular.js",
            url:"https://github.com/alonbardavid/visor"
        },
        {
            title:"Visor",
            description:"Authentication and Authorization framework for angular.js",
            url:"https://github.com/alonbardavid/visor"
        },
        {
            title:"angular-nested-include",
            description:"Call onload after nested ng-include templates finished compiling",
            url:"https://github.com/alonbardavid/angular-nested-include"
        },
        {
            title:"Lograp",
            url:"https://github.com/alonbardavid/lograp",
            description:"Logging wrapper for Winston that automatically adds time and call path"
        },
        {
            title:"Moonshine",
            description:"Work in progress web framework for node.js",
            url:"https://github.com/alonbardavid/moonshine"
        }
    ]
}
