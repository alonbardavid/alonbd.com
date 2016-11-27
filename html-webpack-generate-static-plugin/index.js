var evaluate = require('eval');
var _ = require('lodash');
var WebpackSources = require('webpack-sources');

function HtmlWebpackGenerateStaticPlugin(options) {
    this.options = _.extend({
        routes:[]
    },options);
}

HtmlWebpackGenerateStaticPlugin.prototype.apply = function(compiler) {
    var self = this;
    compiler.plugin('compilation', function(compilation) {
        compilation.plugin('html-webpack-plugin-after-html-processing', function(htmlPluginData, callback) {
            var rawHtml = htmlPluginData.html;
            var code = htmlPluginData.assets.js.map(function(js){
                var assetName = js.substr(1);
                return compilation.assets[assetName].source()
            }).join(";\n");
            code = "var window = global;" + code;
            var generateFunction = evaluate(code,{window:{}});
            var promises = self.options.routes.map(function(route){
                var filename = _.endsWith(route,"/")?route + "index.html" : route;
                filename = _.endsWith(filename,".html")?filename: filename + ".html";
                var result = generateFunction({path:route});
                (result.then ? result: Promise.resolve(result)).then(function(generated){
                    _.forOwn(generated,function(value,key) {
                        var regex = new RegExp("(<[^s]+\\s+id=[\"|']"+ key + "[\"|'][^>]*>)");
                        var htmlResult= rawHtml.replace(regex,"$1" + value);
                        if (filename == htmlPluginData.plugin.options.filename){
                            htmlPluginData.html = htmlResult;
                        } else {
                            compilation.assets[filename] = new WebpackSources.RawSource(htmlResult);
                        }
                    })
                })
            });
            Promise.all(promises).then(callback.bind(null,null,htmlPluginData));
        });
    });

};

module.exports = HtmlWebpackGenerateStaticPlugin;