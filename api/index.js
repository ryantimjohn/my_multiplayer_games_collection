import * as appModule from '../dist/index.cjs';

export default async function handler(req, res) {
  const app = appModule.default || appModule;

  if (appModule.setupPromise) {
    await appModule.setupPromise;
  }

  return app(req, res);
}