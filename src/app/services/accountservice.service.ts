import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountserviceService {
  apiUrl=environment.apiUrl;
  baseUrl: string =this.apiUrl+ "/Account";
  constructor(private http: HttpClient) { }

  GetAllAccountData(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}`);
  }
  PostAccountData(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`,data );
  }
  DeleteAccountData(id: any): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }
  UpdateAccountData(id: any, data: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, data)
  }
  GetAccountById(id:any):Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/${id}`)
  }
}
