import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChangePasswordService {
  count1:number;
  count2:number;

  apiUrl=environment.apiUrl;
  baseUrl: string =this.apiUrl+"/ChangePassword";
  constructor(private http: HttpClient,private router:Router) { }
  UpdatePasswordData(obj): Observable<any> {
    let count1 = 0;
    let count2 = 0;
  
    return this.http.put<any>(`${this.baseUrl}`, obj).pipe(
      map(response => {
        
        if(response=='"New Password updated successfully"') {
          count1 = 1;
        }
        if(response=='"Old Password does not match"') {
          count2 = 2;
        }
        return { count1: count1, count2: count2 };
      }),
      catchError(error => {
        if (error.status === 0) {
          this.router.navigate(['/server-down']);
        }
        return throwError('An error occurred while updating the password. Please try again later.');
      })
    ); 
  }
 
}
