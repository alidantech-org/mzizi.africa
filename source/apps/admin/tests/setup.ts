import { mock } from 'bun:test';

// `server-only` throws outside a Next server build; the tests exercise pure presentation and catalog code.
mock.module('server-only', () => ({}));
