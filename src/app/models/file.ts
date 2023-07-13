export class FileModel{
    public id:number;
    public fileName:string;
    public fileBase64:string;
    public controlName:string;


    constructor(id:number,controlName:string,fileBase64:string,fileName:string) {
        this.id=id;
        this.fileName=fileName;
        this.controlName=controlName;
        this.fileBase64=fileBase64;
    }
}