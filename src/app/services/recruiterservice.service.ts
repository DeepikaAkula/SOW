import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecruiterserviceService {
  apiUrl=environment.apiUrl;
  baseUrl: string =this.apiUrl+ "/Recruiter";
  constructor(private http: HttpClient) { }

  GetAllRecruiterData(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}`);
  }
  PostRecruiterData(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`,data );
  }
  DeleteRecruiterData(id: any): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }
  UpdateRecruiterData(id: any, data: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, data)
  }
  GetRecruiterById(id:any):Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/${id}`)
  }
}
