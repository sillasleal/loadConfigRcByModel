/*
 * The MIT License
 *
 * Copyright 2020 Sillas S. Leal<sillas.s.leal@gmail.com>.
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


const fs = require('fs');

/**
 * Função que retorna o conteúdo do arquivo .ssl-lib_consulrc.js
 * @param {string} name O nome do projeto
 * @param {object} model O modelo das configurações a serem lidas
 * @return {object} Return a object of configs or undefined
 */
module.exports = (name, model) => {
  if (!name || typeof name !== 'string') {
    throw new Error('The name of project need to be a string!');
  }
  const file = `${process.cwd()}/.ssl-lib_${name}rc.js`;
  if (!fs.existsSync(file)) {
    return {};
  }
  if (!model || typeof model !== 'object' || Array.isArray(model)) {
    throw new Error('Model is not a object');
  }
  const content = require(file);
  /**/
  return Object.keys(model).reduce((cur, prop) => ({
    ...cur,
    [prop]: model[prop].validate(content[prop]) ?
        model[prop].format(content[prop]) : model[prop].default,
  }), {});
};
