#!/usr/bin/env node

'use strict';'use strict';
import { execSync } from 'child_process';
import minimist from 'minimist';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const pkg = dirname(fileURLToPath(import.meta.url));
const params = minimist(process.argv.slice(2));
const folder = params.f || params.folder || 'mock';
const port = params.p || params.port || 3000;
const staticUrl = params.s || params.static || 'static';

const db = join('db', '*.json');
const nodemon = `npx nodemon --ignore "${db}"`;
const entrypoint = join(pkg, 'server.mjs')
const target = `"${entrypoint}" "${folder}" "${port}" "${staticUrl}"`;
execSync(`${nodemon} --watch "${folder}" ${target}`, { stdio: 'inherit' });
