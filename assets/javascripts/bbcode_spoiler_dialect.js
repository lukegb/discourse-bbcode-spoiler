(function() {
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

  function generateJsonML (label, contents) {
    var myId = 'spoilerrific-' + generateUniqueishIdentifier();

    var wrappingDiv = ['div'].concat(contents);

    return [
      'div', { 'class': 'spoilerrific' },
      [
        'input', { 'type': 'checkbox', 'id': myId }
      ],
      [
        'label', { 'for': myId }, label
      ],
      wrappingDiv
    ];
  }

  Discourse.BBCode.replaceBBCode('spoiler', function(contents) {
    return generateJsonML('FLARD inside!', contents);
  });
  Discourse.BBCode.replaceBBCodeParamsRaw('spoiler', function(param, contents) {
    var label = param.replace(/(^")|("$)/g, '');
    return generateJsonML(label, contents);
  });
})();