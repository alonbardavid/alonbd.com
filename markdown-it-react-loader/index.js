var markdownIt = require('markdown-it');
var jsx = require('markdown-it-jsx');
var markdownItHighlightjs = require('markdown-it-highlightjs');
var frontMatter = require('markdown-it-front-matter');


module.exports = function (source) {
    this.cacheable()
    var md = markdownIt();
    var fm;
    md.use(jsx);
    md.use(frontMatter, function(res) {
        fm = "{" +
            (res || "").split("\n").join(",") +
             "}";
    });
    md.use(markdownItHighlightjs,{auto:false});
    var content = md.render(source);
    content = content.replace(/<code([^>]*)>/g,'<code $1 dangerouslySetInnerHTML={{__html:`');
    content = content.replace(/<\/code>/g,'`}}></code>');
    var res = [
        "var React = require('react');",
        "module.exports = function(){",
        " return <div>",
        content,
        "</div>",
        "}",
        "module.exports.frontMatter = " + fm
    ].join("\n");
    return res;
}