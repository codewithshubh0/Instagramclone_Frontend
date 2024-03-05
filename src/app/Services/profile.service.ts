import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private url = "http://localhost:8000";

 // private url = "https://instagramclone-api.onrender.com"

  userdetails = {};
  isOwnProfile = false;
  constructor(private http:HttpClient) { }

  setuserdetails(detailofuser:any){
    this.userdetails =  detailofuser;
  }

  getdetails(){
    return this.userdetails;
  }

  storeimage(formdata:any):Observable<any>{
    return this.http.post<any[]>(this.url+"/profileimage/storeimages",formdata);
   }
   getimage(userid:any):Observable<any>{
    return this.http.get(this.url+"/profileimage/getimage/"+userid);
   }
   
    getallusers(userid:any):Observable<any>{
      return this.http.get(this.url+"/users/getallusers/"+userid);
     }
     //
     
    getuserdetails(userid:any):Observable<any>{
      return this.http.get(this.url+"/users/getuserdetail/"+userid);
     }

     
     savefollowactivity(useridfollowedby:any,useridfollowedto):Observable<any>{
        return this.http.post<any[]>(this.url+"/activity/savefollowactivity",{useridfollowedby:useridfollowedby,useridfollowedto:useridfollowedto});
    }

    Unfollowuser(useridfollowedby:any,useridfollowedto):Observable<any>{
         return this.http.post<any[]>(this.url+"/activity/saveunfollowactivity",{useridfollowedby:useridfollowedby,useridfollowedto:useridfollowedto});
    }

  
}
