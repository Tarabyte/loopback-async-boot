const wrapper = require('../');

describe('Looback Async Boot', () => {
  it('should be a function', () => {
    expect(typeof wrapper).toBe('function');
  });

  it('should return a function', () => {
    const fn = jest.fn().mockResolvedValue(true);
    expect(typeof wrapper(fn)).toBe('function');
  });

  it('should call wrapped function w/ app argument', () => {
    const fn = jest.fn().mockResolvedValue(true);
    const wrapped = wrapper(fn);

    const app = {};
    const done = jest.fn();
    wrapped(app, done);

    expect(fn).toBeCalledWith(app);
  });

  it('should call callback w/ null value when wrapped function resolved', async () => {
    const fn = jest.fn().mockResolvedValue({});
    const wrapped = wrapper(fn);

    const app = {};
    const done = jest.fn();

    await wrapped(app, done);

    expect(done).toBeCalledWith(null);
  });

  it('should call callback w/ error when wrapped function rejected', async () => {
    const error = new Error('TestError');
    const fn = jest.fn().mockRejectedValue(error);
    const wrapped = wrapper(fn);

    const app = {};
    const done = jest.fn();

    await wrapped(app, done);

    expect(done).toBeCalledWith(error);
  });

  describe('Non production warning', () => {
    let env = null;
    let warn = null;

    beforeAll(() => {
      env = process.env;
      process.env = Object.assign({}, process.env, { NODE_ENV: 'development' });
      warn = jest
        .spyOn(global.console, 'warn')
        .mockImplementation(() => undefined);
    });

    afterEach(() => {
      warn.mockClear();
    });

    afterAll(() => {
      process.env = env;
      warn.mockRestore();
    });

    it('should warn when wrapped function returns undefined', () => {
      const fn = jest.fn().mockReturnValue(undefined);
      const wrapped = wrapper(fn);

      wrapped({}, jest.fn());

      expect(warn).toBeCalledWith(
        'LoopbackAsyncBoot: expects boot script to return a Promise. Got undefined instead.'
      );
    });

    it('should warn when wrapped function returns non thenable', () => {
      const fn = jest.fn().mockReturnValue(10);
      const wrapped = wrapper(fn);

      wrapped({}, jest.fn());

      expect(warn).toBeCalledWith(
        'LoopbackAsyncBoot: expects boot script to return a Promise. Got number instead.'
      );
    });
  });
});
