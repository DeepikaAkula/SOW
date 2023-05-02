import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  apiUrl=environment.apiUrl;
  baseUrl: string =this.apiUrl+ "/Login";
  loginUrl:string=this.baseUrl+"/GetLoginDetails";

  constructor(private http: HttpClient) { }

  isAuthor:boolean=false;
  
  GetUserData(httpParams:HttpParams): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}`,{ params: httpParams });
  }
  PutUserData(loginName,LoginPassword,data): Observable<any> {
    return this.http.put<any>(this.baseUrl+"/" +loginName+ "?LoginPassword=" + LoginPassword,data);
  }
  GetLoginData(){
    return this.http.get<any>(`${this.loginUrl}`);
  }
}
