export class Delegate{
    public authDate:string|undefined;
    public author:string|undefined;

    constructor(authDate:string|undefined,author:string|undefined) {
        this.authDate=authDate;
        this.author=author;
    }
}