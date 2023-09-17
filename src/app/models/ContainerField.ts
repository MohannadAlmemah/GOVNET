import { Field } from "./field";

export class ContainerField{
    // public containerItems:any;
    public containerId:string; 
    public filedData:any;
    public id:string;
    public index:number;
    public indexId:string;

    constructor(containerId:string,filedData:any,id:string,index:number) {
      this.containerId=containerId;
      this.filedData=filedData;
      this.id=id;
      this.index=index;
      this.indexId=this.id+"#"+this.index;
    }
  }
  

export class Container{
  public containerId:string; 
  public containerFields:Field[]=[];
  public index:number;

  constructor(containerId:string,containerFields:any[],index:number) {
    this.containerId=containerId;
    this.containerFields=containerFields;
    this.index=index;
  }
}