'use strict';

var shared = require('@vueuse/shared');
var vue = require('vue');

function createGenericProjection(fromDomain, toDomain, projector) {
  return (input) => {
    return vue.computed(() => projector(shared.toValue(input), shared.toValue(fromDomain), shared.toValue(toDomain)));
  };
}

function defaultNumericProjector(input, from, to) {
  return (input - from[0]) / (from[1] - from[0]) * (to[1] - to[0]) + to[0];
}
function createProjection(fromDomain, toDomain, projector = defaultNumericProjector) {
  return createGenericProjection(fromDomain, toDomain, projector);
}

function logicAnd(...args) {
  return vue.computed(() => args.every((i) => shared.toValue(i)));
}

function logicNot(v) {
  return vue.computed(() => !shared.toValue(v));
}

function logicOr(...args) {
  return vue.computed(() => args.some((i) => shared.toValue(i)));
}

function useAbs(value) {
  return vue.computed(() => Math.abs(shared.toValue(value)));
}

function toValueArgsFlat(args) {
  return args.flatMap((i) => {
    const v = shared.toValue(i);
    if (Array.isArray(v))
      return v.map((i2) => shared.toValue(i2));
    return [v];
  });
}

function useAverage(...args) {
  return vue.computed(() => {
    const array = toValueArgsFlat(args);
    return array.reduce((sum, v) => sum += v, 0) / array.length;
  });
}

function useCeil(value) {
  return vue.computed(() => Math.ceil(shared.toValue(value)));
}

function useClamp(value, min, max) {
  if (typeof value === "function" || vue.isReadonly(value))
    return vue.computed(() => shared.clamp(shared.toValue(value), shared.toValue(min), shared.toValue(max)));
  const _value = vue.ref(value);
  return vue.computed({
    get() {
      return _value.value = shared.clamp(_value.value, shared.toValue(min), shared.toValue(max));
    },
    set(value2) {
      _value.value = shared.clamp(value2, shared.toValue(min), shared.toValue(max));
    }
  });
}

function useFloor(value) {
  return vue.computed(() => Math.floor(shared.toValue(value)));
}

function useMath(key, ...args) {
  return shared.reactify(Math[key])(...args);
}

function useMax(...args) {
  return vue.computed(() => {
    const array = toValueArgsFlat(args);
    return Math.max(...array);
  });
}

function useMin(...args) {
  return vue.computed(() => {
    const array = toValueArgsFlat(args);
    return Math.min(...array);
  });
}

function accurateMultiply(value, power) {
  const valueStr = value.toString();
  if (value > 0 && valueStr.includes(".")) {
    const decimalPlaces = valueStr.split(".")[1].length;
    const multiplier = 10 ** decimalPlaces;
    return value * multiplier * power / multiplier;
  } else {
    return value * power;
  }
}
function usePrecision(value, digits, options) {
  return vue.computed(() => {
    var _a;
    const _value = shared.toValue(value);
    const _digits = shared.toValue(digits);
    const power = 10 ** _digits;
    return Math[((_a = shared.toValue(options)) == null ? void 0 : _a.math) || "round"](accurateMultiply(_value, power)) / power;
  });
}

function useProjection(input, fromDomain, toDomain, projector) {
  return createProjection(fromDomain, toDomain, projector)(input);
}

function useRound(value) {
  return vue.computed(() => Math.round(shared.toValue(value)));
}

function useSum(...args) {
  return vue.computed(() => toValueArgsFlat(args).reduce((sum, v) => sum += v, 0));
}

function useTrunc(value) {
  return vue.computed(() => Math.trunc(shared.toValue(value)));
}

exports.and = logicAnd;
exports.createGenericProjection = createGenericProjection;
exports.createProjection = createProjection;
exports.logicAnd = logicAnd;
exports.logicNot = logicNot;
exports.logicOr = logicOr;
exports.not = logicNot;
exports.or = logicOr;
exports.useAbs = useAbs;
exports.useAverage = useAverage;
exports.useCeil = useCeil;
exports.useClamp = useClamp;
exports.useFloor = useFloor;
exports.useMath = useMath;
exports.useMax = useMax;
exports.useMin = useMin;
exports.usePrecision = usePrecision;
exports.useProjection = useProjection;
exports.useRound = useRound;
exports.useSum = useSum;
exports.useTrunc = useTrunc;
