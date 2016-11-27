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

            function getSource(filename){
                return compilation.assets[filename].source();
            }
            var rawHtml = htmlPluginData.html;

            var mainEntries = htmlPluginData.assets.js.map(function(js){
                return js.substr(1);
            });
            var extraModules =   _.keys(compilation.assets).filter(function(filename){
                if (_.endsWith(filename,".js") && mainEntries.indexOf(filename) < 0) {
                    return true;
                } else {
                    return false;
                }
            });
            var modules = mainEntries.map(getSource).concat(extraModules.map(getSource));
            var code =["var window = global;\n"].concat(modules).join(";\n");
            var generateFunction = evaluate(code);
            var promises = self.options.routes.map(function(route){
                var filename = _.endsWith(route,"/")?route + "index.html" : route;
                filename = _.endsWith(filename,".html")?filename: filename + ".html";
                var result = generateFunction({path:route});
                return (result.then ? result: Promise.resolve(result)).then(function(generated){
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