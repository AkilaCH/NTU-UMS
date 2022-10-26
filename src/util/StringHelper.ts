export function buildPlaceholder (dataString, params){
    return Function(...Object.keys(params), 'return `' + dataString + '`')
      (...Object.values(params));
}
