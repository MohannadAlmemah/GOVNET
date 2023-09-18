export class FileModel{
    public id:number;
    public fileName:string;
    public fileBase64:string;
    public controlName:string;
    public objectId:string;

    constructor(id:number,controlName:string,fileBase64:string,fileName:string,objectId:string) {
        this.id=id;
        this.fileName=fileName;
        this.controlName=controlName;
        this.fileBase64=fileBase64;
        this.objectId=objectId;
    }
}