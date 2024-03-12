import axios, {AxiosPromise, AxiosRequestConfig, AxiosResponse} from 'axios'
import { Dict } from "@/interface/common";
import {notify} from "@kyvg/vue3-notification";
import {APIUri as httpApi} from "@/api/httpApi";

axios.defaults.withCredentials = true;
axios.interceptors.response.use(
  (res: AxiosResponse) => {
    if (res.data?.code && res.data.code != 0) {
      if(res.config.method == 'get' && res.config.url != "/auth/menus"){
        notify({ type: 'error', text: res.data.msg, duration: 5*1000})
      }
      if(res.data.code == 401){
        window.location.href = '#/login';
      }
    }
    return res;
  },
  error => {
    if (error.response.status === 404) {
      notify({type: 'error', text: '404 not found'})
    }
    if (error.response.status === 500) {
      notify({type: 'error', text: '服务器错误'})
    }
    return {}
  }
);

const APIUri = {
  BaseUri: '/api/v1',
  ...httpApi,
  // ...grpcApi
}

axios.defaults.baseURL = APIUri.BaseUri;
export {APIUri}

type APIResult = {
  code: number,
  msg: string,
  count: number,
  data: Dict[]
}
export const post = (uri: string, data: Dict, config?: AxiosRequestConfig): AxiosPromise => {
  return axios.post(uri, data, config)
}
export const list = (uri: string, params: Dict,  config?: AxiosRequestConfig): AxiosPromise => {
  return axios.get<APIResult>(uri, {params: params, ...config})
}
export const get = (uri: string, id: number, config?: AxiosRequestConfig): AxiosPromise => {
  return axios.get<APIResult>(uri, {params: { id: id }, ...config})
}
export const create = (uri: string, data: Dict): AxiosPromise => {
  return axios.post(uri, data)
}
export const update = (uri: string, data: Dict): AxiosPromise => {
  return axios.put<APIResult>(uri, data)
}
export const del = (uri: string, id: number | string): AxiosPromise => {
  return axios.delete<APIResult>(uri, {params: { id: id }})
}
