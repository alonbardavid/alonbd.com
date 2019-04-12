const highllightJs = require('markdown-it-highlightjs');

module.exports = {
  title:"alonbd.com",
  description:"just playing around",
  evergreen:true,
  head:[
    ['link',{rel:"stylesheet",type:"text/css",href:"/fonts/fonts.css"}]
  ],
  markdown: {
    extendMarkdown : md => {
      md.use(highllightJs)
    }
  },
  themeConfig: {
    contactLinks:[
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
    ]
  },
  plugins: {
    'clean-urls': {
      normalSuffix: '',
      indexSuffix: '/',
    },
  }
}