import path from 'path';
import querystring from 'querystring';
import ResultFile from './result_file';
import UploadResult from './upload_result';

const URI_REGEXP = /^https?:/i;
const DEFAULT_URL_FORMAT = 'url';

export const buildFileParam = async (api, value) => {
  if (URI_REGEXP.test(value)) {
    return value;
  }

  if (value instanceof ResultFile) {
    return value.url;
  }

  return api.upload(value);
};

export const detectFormat = (params) => {
  let resource;

  if (params.Url) {
    return DEFAULT_URL_FORMAT;
  }

  if (params.File) {
    resource = params.File;
  } else if (params.Files) {
    [resource] = params.Files;
  }

  if (resource instanceof ResultFile) {
    resource = resource.url;
  }

  if (resource instanceof UploadResult) {
    resource = resource.fileName;
  }

  return path.extname(resource).substring(1);
};

export const buildQueryString = (params) => {
  const result = {};

  Object.keys(params).forEach((key) => {
    const val = params[key];

    if (val instanceof Array) {
      val.forEach((v, i) => {
        result[`${key}[${i}]`] = v.toString();
      });
    } else {
      result[key] = val.toString();
    }
  });

  return querystring.stringify(result);
};
