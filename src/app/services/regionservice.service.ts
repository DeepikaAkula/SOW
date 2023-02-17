import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegionserviceService {
  apiUrl=environment.apiUrl;
  baseUrl: string =this.apiUrl+ "/Region";
  constructor(private http: HttpClient) { }

  GetAllRegionData(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}`);
  }
  PostRegionData(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`,data );
  }
  DeleteRegionData(id: any): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }
  UpdateRegionData(id: any, data: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, data)
  }
  GetRegionById(id:any):Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/${id}`)
  }
}
