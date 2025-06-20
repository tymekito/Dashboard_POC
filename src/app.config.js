let configCache = null;

function getEnvironmentVariable(environmentVariableKey, source = configCache) {
  return getVariable(environmentVariableKey, source);
}

function getVariable(key, source) {
  if (!source) {
    return null;
  }
  const environmentVariable = source[key];
  if (!environmentVariable && source[key] !== false) {
    throw new Error(`Couldn't find environment variable: ${key}`);
  } else {
    return environmentVariable;
  }
}

export async function loadConfig() {
  const env = process.env.NODE_ENV || "development";
  const configUrl = `/config/config.${env}.json`;
  try {
    const response = await fetch(configUrl);
    if (!response.ok) {
      throw new Error(`Failed to load config: ${response.status}`);
    }
    configCache = await response.json();
  } catch (error) {
    /* eslint-disable-next-line no-console */
    console.error("Error loading config:", error);
    throw error;
  }
}

const Config = {
  apiURL: () => getEnvironmentVariable("apiURL"),
  defaultArea: () => getEnvironmentVariable("defaultArea"),
  appV1Url: () => getEnvironmentVariable("appV1Url"),
};

export default Config;
