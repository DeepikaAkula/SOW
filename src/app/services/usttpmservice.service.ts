import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsttpmserviceService {
  apiUrl=environment.apiUrl;
  baseUrl: string =this.apiUrl+ "/USTTPM";
  constructor(private http: HttpClient) { }

  GetAllUSTTPMData(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}`);
  }
  PostUSTTPMData(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`,data );
  }
  DeleteUSTTPMData(id: any): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }
  UpdateUSTTPMData(id: any, data: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, data)
  }
  GetUSTTPMById(id:any):Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/${id}`)
  }
}
