import Config from "@/app.config.js";
import { HTTP_OPERATIONS } from "@/services/communication/constants.js";
import { displayError, displaySuccess } from "@/services/notiffications/notification-service.js";
import { translationFormatter } from "@/services/translations/translation-service.js";
import { useLoaderStore } from "@/stores/common/loader/store.js";
import axios from "axios";
import qs from "qs";

let api = null;

export function createHTTPClientInstance() {
  api = axios.create({
    baseURL: Config.apiURL(),
  });

  api.interceptors.request.use(
    (config) => {
      const loaderStore = useLoaderStore();
      loaderStore.incrementPendingRequestCount();
      return config;
    },
    (error) => Promise.reject(error),
  );

  api.interceptors.response.use(
    (response) => {
      const loaderStore = useLoaderStore();
      loaderStore.decrementPendingRequestCount();
      return response;
    },
    async (error) => {
      const loaderStore = useLoaderStore();
      loaderStore.decrementPendingRequestCount();
      return Promise.reject(error);
    },
  );
}

function showResultMessage(operation) {
  const loaderStore = useLoaderStore();
  if (loaderStore.displaySuccessMessage === true) {
    const message = getSuccessMessage(operation);
    displaySuccess(message);
  }
}

function showExceptionMessage(error) {
  const message = getErrorMessage(error);
  displayError(message);
}

function getSuccessMessage(operation) {
  switch (operation) {
    case HTTP_OPERATIONS.POST:
    case HTTP_OPERATIONS.PUT:
    case HTTP_OPERATIONS.PATCH:
    case HTTP_OPERATIONS.DELETE:
      return translationFormatter("notifications.success");
    default:
      return translationFormatter("notifications.unsupported-operation");
  }
}

function getErrorMessage(error) {
  switch (error.response?.status) {
    case 404:
      return translationFormatter("notifications.resource-not-found");
    default:
      return error.response?.data.Message ? error.response.data.Message : translationFormatter("notifications.error");
  }
}

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
        showExceptionMessage(e);
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
  async post(resource, data, params, handleError = true) {
    const config = {
      params,
    };
    try {
      var result = await api.post(resource, data, config);
      showResultMessage(HTTP_OPERATIONS.POST);
      return result;
    } catch (e) {
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
      showResultMessage(HTTP_OPERATIONS.POST);
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
      var result = await api.put(resource, data, config);
      showResultMessage(HTTP_OPERATIONS.PUT);
      return result;
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
      var result = await api.patch(resource, data, config);
      showResultMessage(HTTP_OPERATIONS.PATCH);
      return result;
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
      var result = await api.delete(resource, config);
      showResultMessage(HTTP_OPERATIONS.DELETE);
      return result;
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
