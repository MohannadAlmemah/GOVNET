import { Directive, HostListener, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appFileUploadLimit]'
})

export class FileUploadLimitDirective {

  @Input() fieldId: string=''; // Input to receive the field ID
  @Input() multiSelect: boolean=false; // Input to determine if multiSelect is allowed
  @Input() fileCount=0;

  constructor(private el: ElementRef) { }

  @HostListener('change', ['$event'])
  onChange(event: any) {
    event.preventDefault();
    // console.log(this.fileCount);
    // const files = event.target.files;
    // if (this.multiSelect && files.length > 1) {
    //   const hasUploadedFiles = this.fileCount > 0;
    //   if (hasUploadedFiles) {
    //     // Prevent uploading multiple files
    //     event.preventDefault();
    //     this.clearInput();
    //     alert('You can upload only one file when there are uploaded files already.');
    //   }
    // }
  }

  private clearInput() {
    // Clear the file input value
    this.el.nativeElement.value = '';
  }
}
