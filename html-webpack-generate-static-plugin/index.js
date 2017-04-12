var evaluate = require('eval');
var _ = require('lodash');
var Bluebird = require('bluebird');
var WebpackSources = require('webpack-sources');

function HtmlWebpackGenerateStaticPlugin(options) {
    this.options = _.extend({
        routes:[]
    },options);
}
function filenameTransform(path){
    if (_.endsWith(path,"index")){
        return path + ".html";
    }
    var filename = path.lastIndexOf(".") > path.lastIndexOf("/")? path : path + "/index.html";
    return filename;
}
HtmlWebpackGenerateStaticPlugin.prototype.apply = function(compiler) {
    var self = this;
    compiler.plugin('compilation', function(compilation) {
        compilation.plugin('html-webpack-plugin-after-html-processing', function(htmlPluginData, callback) {

            if (compilation.errors && compilation.errors.length > 0){
                return callback(null,htmlPluginData);
            }
            function getSource(chunk){
                var filename = chunk.files[0];
                return compilation.assets[filename].source();
            }
            var rawHtml = htmlPluginData.html;
            var mainEntries = htmlPluginData.assets.js.map(function(js){
                return js.substr(1);
            });
            var chunks = compilation.chunks.filter(function(chunk){
                return !self.options.exclude || self.options.exclude.indexOf(chunk.name) < 0
            }).sort(function(a,b){
                return b.entry || b.id > a.id;
            })
            var modules = chunks.map(getSource);
            var code =["var window = global;\n"].concat(modules).join(";\n");
            try {
                var generateFunction = evaluate(code);
            }catch (e){
                return Bluebird.reject(new Error("failed to execute bundle on server with error - " + e.message));
            }
            var promises = self.options.routes.map(function(route){
                if (typeof route == 'string'){
                    route = {path:route};
                }
                var filename = filenameTransform(route.path);
                try {
                    var result = generateFunction({path: route.path});
                }catch(e){
                    return Bluebird.reject(e);
                }
                return Bluebird.resolve(result).timeout(2000).then(function(generated){
                    var htmlResult = rawHtml;
                    _.forOwn(generated,function(value,key) {
                        var regex = new RegExp("(<[^s]+\\s+id=[\"|']" + key + "[\"|'][^>]*>)");
                        htmlResult= htmlResult.replace(regex, "$1" + value);
                    });
                    if (route.include){
                        route.include.forEach(function(chunkName){
                            var chunk = _.find(compilation.chunks,function(chunk){return chunk.name.indexOf(chunkName) >= 0});
                            if (!chunk){
                                throw new Error("could not find file to include - " + chunkName);
                            }
                            chunk.files.forEach(function(file){
                                if (_.endsWith(file,".js")){
                                    var lastEntryRegex = new RegExp('(src="\\/'+ _.last(mainEntries) + '".*><\\/script>)');
                                    htmlResult = htmlResult.replace(lastEntryRegex,'$1<script defer src="/' + chunk.files[0] + '"></script>');
                                }
                            });
                        });
                    }
                    if (filename == htmlPluginData.plugin.options.filename ||
                        "./" + filename == htmlPluginData.plugin.options.filename){
                        htmlPluginData.html = htmlResult;
                    } else {
                        compilation.assets[filename] = new WebpackSources.RawSource(htmlResult);
                    }
                })
            });
            Promise.all(promises).then(callback.bind(null,null,htmlPluginData)).catch(callback.bind(null));
        });
    });

};

module.exports = HtmlWebpackGenerateStaticPlugin;