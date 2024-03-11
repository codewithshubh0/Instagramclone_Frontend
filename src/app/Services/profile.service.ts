import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  //private url = "http://localhost:8000";

  private url = "https://instagram-backend-igfs.onrender.com"

  userdetails = {};
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

    savebio(userid:any,bio:any):Observable<any>{
      return this.http.post<any[]>(this.url+"/activity/savebio",{userid:userid,bio:bio});
 }


 saveposts(formdata:any):Observable<any>{
    return this.http.post<any[]>(this.url+"/activity/savepost",formdata);
 }

 deleteposts(userid:any,imagename:any):Observable<any>{
  return this.http.post<any[]>(this.url+"/activity/deletepost",{userid:userid,imagename:imagename});
}

savelikes(userid:any,imagename:any,likeuserid:any){
  return this.http.post<any[]>(this.url+"/activity/savelikes",{userid:userid,imagename:imagename,like_userid:likeuserid});
}

savedislikes(userid:any,imagename:any,dislikeuserid:any){
  return this.http.post<any[]>(this.url+"/activity/savedislikes",{userid:userid,imagename:imagename,dislike_userid:dislikeuserid});
}
addcomment(profileuserid:any,commentuserid:any,imagename:any,comment:any){
  return this.http.post<any[]>(this.url+"/activity/addcomment",{profileuserid:profileuserid,commentuserid:commentuserid,imagename:imagename,comment:comment});
}

getalluserdetails():Observable<any>{
  return this.http.get(this.url+"/users/getalluserdetail");
 }

}
