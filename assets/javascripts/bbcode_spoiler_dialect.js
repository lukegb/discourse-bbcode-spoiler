(function() {
  var parser = window.BetterMarkdown,
      MD = parser.Markdown,
      DialectHelpers = parser.DialectHelpers;

  function generateUniqueishIdentifier () {
    // Stolen from StackOverflow: http://stackoverflow.com/a/8809472
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
  }

  function generateJsonML (label, contents, opts) {
    var myId = 'spoilerrific-' + generateUniqueishIdentifier();

    var wrappingDiv = ['div'].concat(contents);

    return [
      'div', { 'class': 'spoilerrific', 'data-prefix': opts.usingDefaultLabel ? 'yes' : 'no', 'data-suffix': opts.usingDefaultLabel ? 'no' : 'yes' },
      [
        'input', { 'type': 'checkbox', 'id': myId }
      ],
      [
        'label', { 'for': myId }, label
      ],
      wrappingDiv
    ];
  }


  // At the moment, Discourse's blocking mechanism seems to be broken
  // such that the below code will only accept block-level Markdown tags
  // (e.g. headers) if they appear as the very first item in the block
  // Therefore, as a (rather hackish) workaround, we recursively invoke
  // the ENTIRE markdown processing chain...
  //var emitter = function(contents, params) {
  //  params = params || '';
  //  var label = params.replace(/(^")|("$)/g, '') || 'FLARD inside!';
  //  return generateJsonML(label, contents);
  //};
  //Discourse.BBCode.register('spoiler', {noWrap: true}, emitter);

  Discourse.Dialect.replaceBlock({
    start: /\[spoiler(=[^\[\]]+)?\]([\s\S]*)/igm,
    stop: /\[\/spoiler\]/igm,
    rawContents: true, // this is documented, but doesn't seem to do anything
    emitter: function(blockContents, matches) {
      var params = matches[1] ? matches[1].replace(/^=/g, '') : '',
          label = params.replace(/(^")|("$)/g, ''),
          opts = {
            usingDefaultLabel: false,
          },
          inner = blockContents.join("\n\n"),
          innerTree = parser.toHTMLTree(inner, "Discourse");

      if (!label) {
          opts.usingDefaultLabel = true;
          label = Discourse.SiteSettings.spoiler_default_label;
      }

      if (!innerTree || innerTree.length === 0 || innerTree[0] != 'html') { // uh?
          return generateJsonML(label, inner, opts);
      }

      return generateJsonML(label, innerTree.slice(1), opts);
    }
  });

  var spoilerrificRe = /^spoilerrific-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/;
  Discourse.Markdown.whiteListTag('div', 'class', 'spoilerrific');
  Discourse.Markdown.whiteListTag('input', 'type', 'checkbox');
  Discourse.Markdown.whiteListTag('input', 'checked', 'checked');
  Discourse.Markdown.whiteListTag('input', 'id', spoilerrificRe);
  Discourse.Markdown.whiteListTag('label', 'for', spoilerrificRe);
  Discourse.Markdown.whiteListTag('label', 'data-prefix', /^(yes|no)$/);
  Discourse.Markdown.whiteListTag('label', 'data-suffix', /^(yes|no)$/);
})();
