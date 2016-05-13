var abnfInterpreter = require('../interpreter');

module.exports = { name: 'interpreter', tests: [
  { name: 'basics', run: function (tools) {
    var i = new abnfInterpreter.Interpreter({
      expression: { type: 'expression', alternatives: [
        [ { type: 'string', value: 'a' } ]
      ] }
    });
    var res = i.getCompleteMatch(i.getPattern('expression'), 'a');
    tools.assertTrue(function() { return res.getType() == 'expression' }, 'wrong type ' + res.getType());
    tools.assertTrue(function() { return res.isExplicit() });
    tools.assertTrue(function() { return res.getSequence().length == 1 });
    tools.assertTrue(function() { return res.getNthItem(0).getType() == 'string-or-char' }, JSON.stringify(res.getNthItem(0),null,2));
  } },
  { name: 'descriptors', run: function (tools) {
    var i = new abnfInterpreter.Interpreter({
      expression: { type: 'expression', alternatives: [
        [ 
          { type: 'described-token', descriptor: 'descriptor', inner: { type: 'string', value: 'a' } },
          { type: 'string', value: 'b' },
        ]
      ] }
    });
    var res = i.getCompleteMatch(i.getPattern('expression'), 'ab');
    tools.assertTrue(function() { return res.getNthItem(0).getDescriptor() == 'descriptor' }, JSON.stringify(res.getNthItem(0),null,2));
    tools.assertTrue(function() { return res.getNthItem(1).getDescriptor() == null }, JSON.stringify(res.getNthItem(1),null,2));
  } },
  { name: 'evaluate', run: function (tools) {
    var evalFn = function() {
      return 'ok';
    };
    var i = new abnfInterpreter.Interpreter({
      expression: { type: 'expression', alternatives: [
        [ { type: 'described-token', descriptor: 'descriptor', inner: { type: 'string', value: 'a' } } ]
      ], evaluate: evalFn }
    });
    var res = i.getCompleteMatch(i.getPattern('expression'), 'a');
    tools.assertTrue(function() { return res.evaluate() == 'ok' });
  } },
]}