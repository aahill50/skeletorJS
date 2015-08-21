/**
 * Created by aaron.hill on 8/12/15.
 */

var jade = require('jade');
var templates = root.rootDir + '/lib/templates';
root.app.set('view engine', 'jade');

var _renderTemplate = function(templateName, locals) {
    locals = locals || {};
    return jade.renderFile(templates + '/' + templateName + '.jade', locals)
};

var appRouter = module.exports = function () {
    root.app.get('/', function(req, res) {
        res.render(root.rootDir + '/lib/templates/application_example', { body: _renderTemplate('chat_example')});
    });
};
