import Config from "@/app.config.js";
import axios from "axios";
import qs from "qs";

const api = axios.create({
  baseURL: Config.apiURL,
});

function showExceptionMessage(error) {
  console.error(getErrorMessage(error));
}

function getErrorMessage(error) {
  if (!error.response) {
    return getServerErrorMessage(error);
  }
  switch (error.response.status) {
    case 404:
      return "not_found";
    case 408:
      return "timeout";
    default:
      return error.response.data.Message ? error.response.data.Message : "error_message";
  }
}

function getServerErrorMessage(error) {
  return error.message;
}

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    return Promise.reject(error);
  },
);

const client = {
  async get(resource, params = {}, handleError = true) {
    const config = {
      params,
      paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
    };
    try {
      return await api.get(resource, config);
    } catch (e) {
      if (handleError) {
        getErrorMessage(e);
      } else {
        throw e;
      }
    }
  },
  getFile: async function (resource, params, handleError = true) {
    const config = {
      params,
      responseType: "blob",
    };
    try {
      return await api.get(resource, config);
    } catch (e) {
      if (handleError) {
        showExceptionMessage(e);
      } else {
        throw e;
      }
    }
  },
  async post(resource, data, params, handleError = true, handleTimeout = true) {
    const config = {
      params,
    };
    try {
      return await api.post(resource, data, config);
    } catch (e) {
      if (handleTimeout && e.response && e.response.status === 408) {
        showExceptionMessage(e);
        return e.response;
      }
      if (handleError) {
        showExceptionMessage(e);
      } else {
        throw e;
      }
    }
  },
  async postWithResult(resource, data, params, handleError = true) {
    const result = { succeed: true, data: null, exception: null };
    const config = {
      params,
    };
    try {
      result.data = await api.post(resource, data, config);
    } catch (exception) {
      result.succeed = false;
      result.exception = exception;
      if (handleError) {
        showExceptionMessage(exception);
      }
    }

    return result;
  },
  async put(resource, data, params, handleError = true) {
    const config = {
      params,
    };
    try {
      return await api.put(resource, data, config);
    } catch (e) {
      if (handleError) {
        showExceptionMessage(e);
      } else {
        throw e;
      }
    }
  },
  async patch(resource, data, params, handleError = true) {
    const config = {
      params,
    };
    try {
      return await api.patch(resource, data, config);
    } catch (e) {
      if (handleError) {
        showExceptionMessage(e);
      } else {
        throw e;
      }
    }
  },
  async delete(resource, params, handleError = true) {
    const config = {
      params,
    };
    try {
      return await api.delete(resource, config);
    } catch (e) {
      if (handleError) {
        showExceptionMessage(e);
      } else {
        throw e;
      }
    }
  },
};

export default client;

export function isSuccessfulResult(result) {
  const resultHttpCodeFirstNumber = result.status.toString()[0].toString();
  return resultHttpCodeFirstNumber === "2";
}
