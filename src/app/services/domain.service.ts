import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DomainService {
  apiUrl=environment.apiUrl;
  baseUrl: string =this.apiUrl+ "/Domain";
  constructor(private http: HttpClient) { }

  GetAllDomainData(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}`);
  }
  PostDomainData(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`,data );
  }
  DeleteDomainData(id: any): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }
  UpdateDomainData(id: any, data: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, data)
  }
  GetDomainById(id:any):Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/${id}`)
  }
}
