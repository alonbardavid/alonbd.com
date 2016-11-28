var markdownIt = require('markdown-it');
var jsx = require('markdown-it-jsx');


module.exports = function (source) {
    this.cacheable()
    var md = markdownIt();
    md.use(jsx);
    var content = md.render(source);
    var res = [
        "var React = require('react');",
        "module.exports = function(){",
        " return <div>",
        content,
        "</div>",
        "}"
    ].join("\n");
    return res;
}