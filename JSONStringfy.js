
const JSONStringify = (obj) => {

  const isArray = (value) => {
    return Array.isArray(value) && typeof value === 'object';
  };

  const isObject = (value) => {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  };

  const isString = (value) => {
    return typeof value === 'string';
  };

  const isBoolean = (value) => {
    return typeof value === 'boolean';
  };

  const isNumber = (value) => {
    return typeof value === 'number';
  };

  const isNull = (value) => {
    return value === null && typeof value === 'object';
  };

  const isNotNumber = (value) => {
    return typeof value === 'number' && isNaN(value);
  };

  const isInfinity = (value) => {
    return typeof value === 'number' && !isFinite(value);
  };

  const isDate = (value) => {
    return typeof value === 'object' && value !== null && typeof value.getMonth === 'function';
  };

  const isUndefined = (value) => {
    return value === undefined && typeof value === 'undefined';
  };

  const isFunction = (value) => {
    return typeof value === 'function';
  };

  const isSymbol = (value) => {
    return typeof value === 'symbol';
  };

  const restOfDataTypes = (value) => {
    return isNumber(value) || isString(value) || isBoolean(value);
  };

  const ignoreDataTypes = (value) => {
    return isUndefined(value) || isFunction(value) || isSymbol(value);
  };

  const nullDataTypes = (value) => {
    return isNotNumber(value) || isInfinity(value) || isNull(value);
  }

  const arrayValuesNullTypes = (value) => {
    return isNotNumber(value) || isInfinity(value) || isNull(value) || ignoreDataTypes(value);
  }

  const removeComma = (str) => {
    const tempArr = str.split('');
    tempArr.pop();
    return tempArr.join('');
  };


  if (ignoreDataTypes(obj)) {
    return undefined;
  }

  if (isDate(obj)) {
    return `"${obj.toISOString()}"`;
  }

  if(nullDataTypes(obj)) {
    return `${null}`
  }

  if(isSymbol(obj)) {
    return undefined;
  }


  if (restOfDataTypes(obj)) {
    const passQuotes = isString(obj) ? `"` : '';
    return `${passQuotes}${obj}${passQuotes}`;
  }

  if (isArray(obj)) {
    let arrStr = '';
    obj.forEach((eachValue) => {
      arrStr += arrayValuesNullTypes(eachValue) ? JSONStringify(null) : JSONStringify(eachValue);
      arrStr += ','
    });

    return  `[` + removeComma(arrStr) + `]`;
  }

  if (isObject(obj)) {
      
    let objStr = '';

    const objKeys = Object.keys(obj);

    objKeys.forEach((eachKey) => {
        const eachValue = obj[eachKey];
        objStr +=  (!ignoreDataTypes(eachValue)) ? `"${eachKey}":${JSONStringify(eachValue)},` : '';
    });
    return `{` + removeComma(objStr) + `}`;
  }
};


const testObj = {
  name: 'John',
  age: 20,
  isMan: true,
  income: null,
  wife: undefined
};

const nestedObj = {
  ...testObj,
  address: {
    city: 'San Francisco',
    zipCode: 94130
  }
};
const objWithDate = {
  ...testObj,
  birthDate: new Date()
};

const testCases = [
  { value: 1234, key: 'Number' },
  { value: 'test', key: 'String' },
  { value: true, key: 'Boolean' },
  { value: testObj, key: 'Object' },
  { value: nestedObj, key: 'Nested Objects' },
  { value: [1, 2, 3, null], key: 'Array' },
  { value: [1, 2, Symbol(), 4, [undefined, 8, 9, [10]]], key: 'Nested Array' },
  { value: { ...testObj, testArr: [1, 2, 3, () => {}, [10]] }, key: 'Object with Arrays' },
  { value: new Date(), key: 'Date' },
  { value: objWithDate, key: 'Object with Date' },
  { value: null, key: 'Null' },
  { value: undefined, key: 'Undefined' },
  { value: () => {}, key: 'Function' },
  { value: { ...testObj, testFunc: () => {} }, key: 'Object with Function' }
];

const checkTestCases = (yourCustomFunction) => {
    let check = true;
    let testCaseFailed = {};
    for(let i = 0; i < testCases.length; i++) {
        const { key, value } = testCases[i];
        if(JSON.stringify(value) !== yourCustomFunction(value)) {
            check = false;
            testCaseFailed = { key, value }
            break;
        }
    };
    if(check) {
        console.log('All Test cases has passed')
    } else {
        console.log(`Test Case for "${testCaseFailed.key}" has Failed`);
        console.log(`Test Case: ${testCaseFailed.value}`)
    }
};

checkTestCases(JSONStringify);

