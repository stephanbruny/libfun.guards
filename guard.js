(() => {
  'use strict';
  
  let throwTypeError = message => { throw new TypeError(message) };
  
  let type = t => val => (typeof(val) === t);
  
  let defaultValidator = (v => v !== undefined && v !== null);

  let guardFn = (guardType, typeErrorMessage) => (defaultValue, validator, validateErrorMessage) => {
    validator = validator || defaultValidator;
    let guardTypeFn = ((typeof(guardType) === 'function') ? guardType : type(guardType));
    return val => 
    	val ? 
    	validator(val) ? 
      	guardTypeFn(val) ? 
        	val 
          : throwTypeError(typeErrorMessage || "Invalid type (" + typeof(val) + ') ' + guardType + ' expected')
        : throwTypeError(validateErrorMessage || ("Invalid value " + val))
      : defaultValidator(defaultValue) ? 
      	guardTypeFn(defaultValue) ? 
        	defaultValue 
          : throwTypeError("Invalid default value for type " + guardType)
        : throwTypeError("Cannot create guard value from null or undefined (Forgot default?)")
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
