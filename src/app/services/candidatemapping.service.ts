import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CandidatemappingService {
  apiUrl=environment.apiUrl;
  baseUrl: string =this.apiUrl+ "/SoWCandidate";
  constructor(private http: HttpClient) { }

  GetAllCandidateMappingData(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}`);
  }
  PostCandidateMappingData(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`,data );
  }
  DeleteCandidateMappingData(id: any): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }
  UpdateCandidateMappingData(id: any, data: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, data)
  }
  GetCandidateById(id:any):Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/${id}`)
  }
}
