var evaluate = require('eval');
var _ = require('lodash');
var Bluebird = require('bluebird');
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

            if (compilation.errors && compilation.errors.length > 0){
                return callback(null,htmlPluginData);
            }
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
            try {
                var generateFunction = evaluate(code);
            }catch (e){
                return Bluebird.reject(e);
            }
            var promises = self.options.routes.map(function(route){
                if (typeof route == 'string'){
                    route = {path:route};
                }
                var filename = _.endsWith(route.path,"/")?route.path + "index.html" : route.path;
                filename = _.endsWith(filename,".html")?filename: filename + ".html";
                try {
                    var result = generateFunction({path: route.path});
                }catch(e){
                    return Bluebird.reject(e);
                }
                return Bluebird.resolve(result).timeout(2000).then(function(generated){
                    _.forOwn(generated,function(value,key) {
                        var regex = new RegExp("(<[^s]+\\s+id=[\"|']"+ key + "[\"|'][^>]*>)");
                        var htmlResult= rawHtml.replace(regex,"$1" + value);
                        if (route.include){
                            route.include.forEach(function(chunkName){
                                var chunk = _.find(compilation.chunks,function(chunk){return chunk.name == chunkName});
                                chunk.files.forEach(function(file){
                                    if (_.endsWith(file,".js")){
                                        var lastEntryRegex = new RegExp('(src="\\/'+ _.last(mainEntries) + '"><\\/script>)');
                                        htmlResult = htmlResult.replace(lastEntryRegex,'$1<script src="/' + chunk.files[0] + '"></script>');
                                    }
                                });
                            });
                        }
                        if (filename == htmlPluginData.plugin.options.filename){
                            htmlPluginData.html = htmlResult;
                        } else {
                            compilation.assets[filename] = new WebpackSources.RawSource(htmlResult);
                        }
                    })
                })
            });
            Promise.all(promises).then(callback.bind(null,null,htmlPluginData)).catch(callback.bind(null));
        });
    });

};

module.exports = HtmlWebpackGenerateStaticPlugin;