export class parentModel{
    type:string|undefined;
    editable:boolean|undefined;
    hidden:boolean|undefined;
    required:boolean=false;
    condition:CarbonCopyConditionLogicOperation|undefined;
}

  export class CarbonCopyConditionLogicOperation {
    left: CarbonCopyConditionLogicOperation|undefined;
    right: CarbonCopyConditionLogicOperation|undefined;
    type:string|undefined;
    operation: string | undefined;
    fieldId:string|undefined;
  }
