let setTitle = __SERVER__
? title => require('continuation-local-storage').getNamespace('ls').get('setTitle')(title)
: value => document.title = value;


export default setTitle;
