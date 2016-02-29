(() => {
  'use strict';
  
  let throwTypeError = message => { throw new TypeError(message) };
  
  
  let type = (t, val) => (typeof(val) === t)  ? val : throwTypeError("Invalid type. " + t + " expected.")
  
  let guardFn = (guardType) => (defaultValue, validator, validateErrorMessage) => {
    validator = validator || (() => true);
    return val => val ?
      validator(val || defaultValue) ? 
        ((typeof(guardType) === 'function') ? 
        	guardType(val) 
          : type(guardType, val) 
         ) ? val : throwTypeError("Invalid type " + typeof(val)) 
         : throwTypeError(validateErrorMessage || ("Invalid value " + val)) 
      : defaultValue;
  };
  
  let guardSchema = (schema) => (val) => {
  	val = val || {};
    for (let key in schema) {
      val[key] = schema[key](val[key]);
    }
    return val;
  };
  
  let guard = {
    Number: guardFn('number'),
    String: guardFn('string'),
    Bool: guardFn('boolean'),
    Array: guardFn( v => Array.isArray(v) ),
    Object: guardFn('object'),
    Schema: guardSchema
  }
  
  return guard;
})();
