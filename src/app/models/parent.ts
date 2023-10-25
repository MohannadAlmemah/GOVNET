export class parentModel{
    type:string|undefined;
    editable:boolean|undefined;
    hidden:boolean|undefined;
    required:boolean=false;
    condition:CarbonCopyConditionLogicOperation|undefined;
}

// You would need to define or import these types as appropriate for your code.
export class CarbonCopyConditionStep {
    ConditionLogic: CarbonCopyConditionLogic = new CarbonCopyConditionLogic;
    Result: boolean = false;
  }
  
  export class CarbonCopyConditionLogic {
    type:string|undefined;
  }

  export class CarbonCopyConditionLogicOperation extends CarbonCopyConditionLogic {
    left: any;
    right: any;
    operation: string | undefined;
  }
  
  export class CarbonCopyConditionLogicInput extends CarbonCopyConditionLogic {
    inputType: string | undefined;
    input: string='';
  }
  
  export class CarbonCopyConditionLogicUI extends CarbonCopyConditionLogic {
    fieldId: string | undefined;
  }
  
export interface ValueField {
    FieldId: string | undefined;
    getValue(): string | boolean;
}