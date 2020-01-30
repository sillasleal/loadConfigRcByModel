/*
 * The MIT License
 *
 * Copyright 2019 Sillas S. Leal<sillas.s.leal@gmail.com>.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

jest.mock('fs', () => ({
    existsSync: () => true,
  }));
const loadConfigRc = require('../src/index');

describe('loadConfigRc', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('is defined', () => {
    expect(loadConfigRc).toBeDefined();
  });

  it('is a function', () => {
    expect(typeof loadConfigRc).toEqual('function');
  });

  it('error if not inform a name', () => {
    expect(() => loadConfigRc()).toThrow('The name of project need to be a string!');
  });

  it('error if inform a invalid name', () => {
    expect(() => loadConfigRc(5)).toThrow('The name of project need to be a string!');
  });

  it('error if not pass a model', () => {
    expect(() => loadConfigRc('unit-test')).toThrow('Model is not a object');
  });

  it('model need to be a object', () => {
    expect(() => loadConfigRc('unit-test', 5)).toThrow('Model is not a object');
    expect(() => loadConfigRc('unit-test', [
      ])).toThrow('Model is not a object');
    expect(() => loadConfigRc('unit-test', false)).toThrow('Model is not a object');
  });

  it('return a object if file not exists', () => {
    jest.mock('fs', () => ({
        existsSync: () => false,
      }));
    const loadConfigRC = require('../src/');
    expect(typeof loadConfigRC('unit-test', { })).toEqual('object');
  });

  it('return a object ', () => {
    jest.mock(`${process.cwd()}/.ssl-lib_unit-testrc.js`, () => ({
        path: ['qwerty', 'asdf'],
        configDir: '/qwerty/asdf',
      }));
    expect(loadConfigRc('unit-test', { })).toEqual({ });
  });

  it('return a object of configs', () => {
    jest.mock(`${process.cwd()}/.ssl-lib_unit-testrc.js`, () => ({
        path: ['qwerty', 'asdf'],
        configDir: '/qwerty/asdf',
      }));
    expect(loadConfigRc('unit-test', {
      configDir: {
        validate: (v) => typeof v === 'string',
        format: (v) => v,
        default: process.cwd(),
      },
      path: {
        validate: (v) => (typeof v === 'string' && v.length) ||
            (Array.isArray(v) && v.every((i) => typeof i === 'string')),
        format: (v) => typeof v === 'string' ? [v] : v,
        default: undefined,
      },
    })).toEqual({
      path: ['qwerty', 'asdf'],
      configDir: '/qwerty/asdf',
    });
  });

  it('remove all others properties and irregular values', () => {
    jest.mock('fs', () => ({
        existsSync: () => true,
      }));
    jest.mock(`${process.cwd()}/.ssl-lib_unit-testrc.js`, () => ({
        path: ['qwerty', 'asdf'],
        configDir: 12345,
        ap: 100,
      }));
    expect(loadConfigRc('unit-test', {
      configDir: {
        validate: (v) => typeof v === 'string',
        format: (v) => v,
        default: process.cwd(),
      },
      path: {
        validate: (v) => (typeof v === 'string' && v.length) ||
            (Array.isArray(v) && v.every((i) => typeof i === 'string')),
        format: (v) => typeof v === 'string' ? [v] : v,
        default: undefined,
      },
    })).toEqual({
      path: ['qwerty', 'asdf'],
      configDir: process.cwd(),
    });
  });
});
