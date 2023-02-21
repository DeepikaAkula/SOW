import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  apiUrl=environment.apiUrl;
  baseUrl: string =this.apiUrl+"/DashboardStats";
  constructor(private http: HttpClient) { }
   GetSODashboardData(period: string): Observable<any> {
   return this.http.get<any>(this.baseUrl+"?period="+period);
   }
   GetCandidateDashboardData(period:string): Observable<any> {
    return this.http.get<any>(this.baseUrl+"/GetCandidatesStats?period="+period);
   }
}
