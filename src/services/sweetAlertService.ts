import Swal from 'sweetalert2';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SweetAlertService{

    ShowAlert(icon: 'success' | 'error' | 'warning' | 'info' | 'question' = 'info', message:string) : void{
        Swal.fire({
            title: message,
            icon: icon,
          });
    }

     ShowAlertThenRedirect(icon: 'success' | 'error' | 'warning' | 'info' | 'question' = 'info', message:string,redirectTo:string):void{
        Swal.fire({
            title: message,
            icon: icon,
          }).then((result) => {
             location.href=redirectTo;
          });
    }
    

    public async AlertConfirmation(title:string,confirmButtonText:string): Promise<boolean> {
      const result = await Swal.fire({
        title: title,
        //text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: confirmButtonText,
      });
    
      return result.isConfirmed;
    }

}