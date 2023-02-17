import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DellmanagerserviceService {
  apiUrl=environment.apiUrl;
  baseUrl: string =this.apiUrl+ "/DellManager";
  constructor(private http: HttpClient) { }

  GetAllDellManagerData(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}`);
  }
  PostDellManagerData(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`,data );
  }
  DeleteDellManagerData(id: any): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }
  UpdateDellManagerData(id: any, data: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, data)
  }
  GetDellManagerById(id:any):Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/${id}`)
  }
}
