import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UstpocserviceService {
  apiUrl=environment.apiUrl;
  baseUrl: string = this.apiUrl+"/UstPoc";
  constructor(private http: HttpClient) { }

  GetAllUstPocData(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}`);
  }
  PostUstPocData(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`,data );
  }
  DeleteUstPocData(id: any): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }
  UpdateUstPocData(id: any, data: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, data)
  }
  GetUstPocById(id:any):Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/${id}`)
  }
}
