class DeepDiffMapper {
  constructor() {
    this.VALUE_CREATED = 'created';
    this.VALUE_UPDATED = 'updated';
    this.VALUE_DELETED = 'deleted';
    this.VALUE_UNCHANGED = 'unchanged';
  }

  map(obj1, obj2) {
    if (this.isFunction(obj1) || this.isFunction(obj2)) {
      throw 'Invalid argument. Function given, object expected.';
    }
    if (this.isValue(obj1) || this.isValue(obj2)) {
      return {
        type: this.compareValues(obj1, obj2),
        data: (obj1 === undefined) ? obj2 : obj1,
      };
    }

    var diff = {};
    for (var key in obj1) {
      if (this.isFunction(obj1[key])) {
        continue;
      }

      var value2 = undefined;
      if ('undefined' != typeof(obj2[key])) {
        value2 = obj2[key];
      }

      diff[key] = this.map(obj1[key], value2);
    }
    for (var key in obj2) {
      if (this.isFunction(obj2[key]) || ('undefined' != typeof(diff[key]))) {
        continue;
      }

      diff[key] = this.map(undefined, obj2[key]);
    }

    return diff;
  }

  compareValues(value1, value2) {
    if (value1 === value2) {
      return this.VALUE_UNCHANGED;
    }
    if ('undefined' == typeof(value1)) {
      return this.VALUE_CREATED;
    }
    if ('undefined' == typeof(value2)) {
      return this.VALUE_DELETED;
    }

    return this.VALUE_UPDATED;
  }

  isFunction(obj) {
    return {}.toString.apply(obj) === '[object Function]';
  }
  isArray(obj) {
    return {}.toString.apply(obj) === '[object Array]';
  }
  isObject(obj) {
    return {}.toString.apply(obj) === '[object Object]';
  }
  isValue(obj) {
    return !this.isObject(obj) && !this.isArray(obj);
  }
}

export default DeepDiffMapper;
