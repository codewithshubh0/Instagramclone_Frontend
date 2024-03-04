import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginsignupService {

  private url = "http://localhost:8000";

  constructor(private http:HttpClient) { }
  
  createuser(email:any,fullname:any,username:any,password:any):Observable<any>{
     return this.http.post<any[]>(this.url + "/signup/createuser",{email:email,fullname:fullname,username:username,password:password});
  }

  checkuser(email:any,password:any):Observable<any>{
    return this.http.post<any[]>(this.url + "/login/checkuser",{email:email,password:password});
 }

}
