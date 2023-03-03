import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  apiUrl=environment.apiUrl;
  baseUrl: string =this.apiUrl+ "/Registration";
  loginUrl:string=this.baseUrl+"/GetLoginDetails";

  constructor(private http: HttpClient) { }
  GetRoleData(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}`);
  }
  PostRegistrationData(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`,data );
  }
  GetLoginData(){
    return this.http.get<any>(`${this.loginUrl}`);
  }
  UpdateLoginData(id: any, data: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, data)
  }
  DeleteLoginData(id: any): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }
}
