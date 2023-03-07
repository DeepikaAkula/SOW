import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StatusserviceService {
  apiUrl = environment.apiUrl;
  baseUrl: string = this.apiUrl + "/Status";
  constructor(private http: HttpClient) { }

  GetAllStatusData(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}`);
  }

  PostStatusData(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, data);
  }

  DeleteStatusData(id: any): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }

  UpdateStatusData(id: any, data: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, data)
  }

  GetStatusById(id: any): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`)
  }

  GetStatusByType(statusTypeId: Number): Observable<any> {
    return this.http.get<any>(this.baseUrl + "/GetStatusByType?id=" + statusTypeId);
  }

}
