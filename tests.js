const retry = (times, fn) => fn()
  .catch(err => times > 0 
    ? retry(times - 1, fn)
    : Promise.reject(times));

const wrapper = arg => () => arg;

const prop = name => obj => obj[name];

const propEq = (name, value) => obj => obj[name] === value;

const propMatch = (prop, fn) => obj => fn(obj[prop]);

const awaitValues = obj => {
  const objInArray = Object.entries(obj);
  return Promise.all(objInArray.map(entry => entry[1]))
    .then(values => {
      let i = 0;
      for (let key in obj) {
        obj[key] = values[i++]
      }
    })
    .then(() => Promise.resolve(obj))
}

const curry = fn => (...params) => params.length === fn.length ? fn(...params) : curryHelper(fn)(...params);

const curryHelper = fn => (...params) => (...newParams) => curry(fn)(...[...params, ...newParams]);

const add = curry((a, b) => a + b);

const has = curry((name, obj) => !!obj[name]);

const inc = number => ++number;

const select = fields => `select ${fields.length > 1 ? fields.join(', '): fields.toString()}`;
const from = table => `from ${table}`;
const whr = (field, condition, value) => `${field} ${condition} ${value}`;
const or = (...conditions) = 

function* generator() {
  const slct = select(yield);
  const frm = from(yield);
  const whr = where(yield);
  yield `${slct} ${frm} ${whr}`;
}

// TESTING
console.log(add(1)(2));
console.log(has('name', { name: 2 }))
console.log(inc(40));

const gen = generator();
console.log(gen.next(), gen.next(['id', 'nome']), gen.next('users'))
