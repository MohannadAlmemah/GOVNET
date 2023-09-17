export class Member{
    public natId:string|undefined;
    public name:string|undefined;
    public sharespaid:string|undefined;
    public nationality:string|undefined;
    public status:string|undefined;

    constructor(natId:string|undefined,name:string|undefined,sharespaid:string|undefined,
        nationality:string|undefined,status:string|undefined
        ) {
        this.natId=natId;
        this.name=name;
        this.sharespaid=sharespaid;
        this.nationality=nationality;
        this.status=status;
    }
}