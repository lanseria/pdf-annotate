/* eslint-disable @typescript-eslint/no-explicit-any */
interface Fn<T = any, R = T> {
  (...arg: T[]): R;
}

interface PromiseFn<T = any, R = T> {
  (...arg: T[]): Promise<R>;
}

interface IObj<T = any> {
  [key: string]: T;
  [key: number]: T;
}

interface PdfAnnotateVO {
  id: number;
  content: string;
  createTime: string;
  isShared: string;
  pageNumber: number;
  relationId: number;
  remarks: string;
  realName: string;
  reviewUrl: string;
  userId: number;
}

interface PdfPageVO {
  cover: string;
  createTime: string;
  delFlag: string;
  id: number;
  isComment: string;
  name: string;
  pageNumber: number;
  previewUrl: string;
  updateTime: string;
  url: string;
  userId: number;
}

interface PaintState {
  size: number;
  color: string;
}

interface TextState {
  size: number;
  color: string;
  family: string;
}

interface TextAreaItemVO {
  id: string;
  x: number;
  y: number;
  text: string;
}
