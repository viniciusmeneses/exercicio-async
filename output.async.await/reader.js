const Reader = computation => ({
  run: computation,
  bind: fn => Reader(context => fn(computation(context)).run(context)),
  map: fn => Reader(context => fn(computation(context))),
});

Reader.pure = val => Reader(() => val);

const Maybe = value => ({
  fromMaybe: value,
  bind: fn => value ? fn(value) : Maybe(null),
  map: fn => Maybe(value ? fn(value) : null),
});

Maybe.pure = Maybe;

const doM = fn => {
  const gen = fn();
  const step = next => {
    const { done, value } = gen.next(next);
    return done ? value : value.bind(step);
  }
  return step();
};

const create = params => Reader(({ db, account }) => {
  const id = Object.keys(db).length + 1;
  db[id] = params;
  db[id].id = id;
  db[id].account = account;
  return db[id];
});

const find = id => Reader(({ db }) => Maybe(db[id]));

const program = doM(function* () {
  const p1 = yield create({ name: "Bla" });
  const p2 = yield create({ name: "Ble" });
  return Reader.pure([p1, p2]);
});

const programWithoutDo =
  create({ name: "Bla" })
    .bind(p1 =>
      create({ name: "Ble" })
        .bind(p2 =>
          Reader.pure([p1, p2])
        )
    );

const programMaybe = doM(function* () {
  const bla = yield Maybe(1);
  const ble = yield Maybe(2).map(n => n * 2);
  return Maybe(bla + ble);
});

const db = {};

console.log(program.run({ db, account: 1 }));
console.log(programWithoutDo.run({ db, account: 2 }));
console.log(programMaybe.fromMaybe);
