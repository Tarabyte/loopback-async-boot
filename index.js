module.exports = boot => (app, next) => {
  const booting = boot(app);

  if (
    process.env.NODE_ENV !== 'production' &&
    !(booting && typeof booting.then === 'function')
  ) {
    // eslint-disable-next-line no-console
    console.warn(
      `LoopbackAsyncBoot: expects boot script to return a Promise. Got ${typeof booting} instead.`
    );
  }

  return Promise.resolve(booting)
    .then(() => next(null))
    .catch(next);
};
