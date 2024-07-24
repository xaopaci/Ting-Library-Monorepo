import microApp from '@micro-zoe/micro-app'
import { createStorage } from '@tingcode/utils'

export enum GlobalStorageKeyEnum {
  KEY = 'GLOBAL_STORAGE',
  TOKEN = 'TOKEN'
}

const GlobalStorage = createStorage({ prefixKey: GlobalStorageKeyEnum.KEY })
export function getGlobalStorage<U, T>(key: GlobalStorageKeyEnum, def?: T): U | T {
  return GlobalStorage.get(key, def)
}
export function setGlobalStorage(key: GlobalStorageKeyEnum, value: unknown) {
  GlobalStorage.set(key, value)
}

export enum GlobalDataKeyEnum {
  ENV = 'ENV'
}

export function getMicroAppFn() {
  const namespace = window?.namespace
  return namespace === 'admin' ? microApp : window.microApp
}

export function getGlobalData() {
  const microAppFn = getMicroAppFn()
  return microAppFn?.getGlobalData() // 子应用返回全局数据
}

export function setGlobalData(key: GlobalDataKeyEnum, value: unknown, fn = () => {}) {
  const microAppFn = getMicroAppFn()
  microAppFn?.setGlobalData({ [key]: value }, fn)
}

export function addGlobalDataListener(fn: () => any) {
  const microAppFn = getMicroAppFn()
  microAppFn.addGlobalDataListener(fn)
}

export * from './env'
export * from './token'
