import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChangePasswordService {

  apiUrl=environment.apiUrl;
  baseUrl: string =this.apiUrl+"/ChangePassword";
  constructor(private http: HttpClient) { }
  UpdatePasswordData(data: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}`,data );
  }
   
}
