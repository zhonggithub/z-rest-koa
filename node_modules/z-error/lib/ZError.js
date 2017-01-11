'use strict';

const getMessage = require('./errorTable').getMessage;

class ZError extends Error{
  constructor(name = '', status = 500, code = '', local = 'en', message = '', description = ''){
    super();
    this.name = name ? name : '';
    this.code = code ? code : '';
    this.local = local;
    this.message = message ? message : (code ? getMessage(code, local) : '');
    this.description = description ? description : '';
    this.status = status;	
  }

  getMessage(local){
    if(!this.code)
        return '';
    let tmpLocal = local ? local : this.local;
    return getMessage(this.code, tmpLocal);
  }
}
module.exports = ZError;
