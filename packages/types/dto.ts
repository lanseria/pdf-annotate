export class PdfAnnotateDTO implements PdfAnnotateVO {
  id: number = 0;
  realName: string = "";
  content: string = "";
  createTime: string = "";
  isShared: string = "";
  pageNumber: number = 0;
  relationId: number = 0;
  remarks: string = "";
  reviewUrl: string = "";
  userId: number = 0;
}

export class PdfPageDTO implements PdfPageVO {
  cover = "";
  createTime = "";
  delFlag = "0";
  id = 1;
  isComment = "0";
  name = "";
  pageNumber = 1;
  previewUrl = "";
  updateTime = "";
  url = "";
  userId = 1;
}
