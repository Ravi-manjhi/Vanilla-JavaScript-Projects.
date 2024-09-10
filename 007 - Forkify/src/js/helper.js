import axios from "axios";
import { async } from "regenerator-runtime";
import { TIMEOUT } from "./config.js";

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async (url, uploadData = undefined) => {
  const fetch = uploadData ? axios.post(url, uploadData) : axios.get(url);
  try {
    const res = await Promise.race([fetch, timeout(TIMEOUT)]);
    const { data } = res.data;
    return data;
  } catch (err) {
    throw err;
  }
};
