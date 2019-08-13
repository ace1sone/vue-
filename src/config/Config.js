function handleEnv(env) {
  if (env === 'prod') {
    return 'prod';
  }
  if (env === 'beta') {
    return 'beta';
  }
  if (env === 'gamma') {
    return 'gamma';
  }
  return 'dev';
}

const env = handleEnv(ENV);

const baseURLMap = {
  dev: 'http://api-alpha.heywoof.com',
  beta: 'http://api-beta.heywoof.com',
  prod: 'http://api-new.heywoof.com',
  gamma: 'http://api-gamma.heywoof.com',
};

const fileURLMap = {
  dev: 'http://api-alpha.heywoof.com',
  beta: 'http://api-beta.heywoof.com',
  prod: 'http://api-new.heywoof.com',
  gamma: 'http://api-gamma.heywoof.com',
};

export default class Config {
  static env = env;

  static baseURL = baseURLMap[env];

  static fileURL = fileURLMap[env];
}
