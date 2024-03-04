import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from 'src/app/Services/profile.service';
import { Buffer } from 'buffer';
@Component({
  selector: 'app-profilepage',
  templateUrl: './profilepage.component.html',
  styleUrls: ['./profilepage.component.css']
})
export class ProfilepageComponent implements OnInit {

profileimgurl = "../assets/defaultprofilepic.png";
file:any
showsave:boolean = false;
showupload:boolean = true;
AccountName = ""
post:number=0;
follower:number=0;
following:number=0;
bio:any="";
isfromSearch = false;
userdetail = {}
isfollowing = false;
constructor(private router:Router,private service:ProfileService){}
  
ngOnInit(): void {
  
  this.userdetail = this.service.getdetails();
   if(this.userdetail!=null || this.userdetail!=undefined){
        this.getimage(this.userdetail[0].userid);
        this.AccountName = this.userdetail[0].username;
        // this.post = this.userdetail[0].post;
           this.follower = this.userdetail[0].followers.length;
           this.following = this.userdetail[0].followings.length;
          console.log(this,this.follower,this.following,"count");
          
           // this.bio = this.userdetail[0].bio 
        this.isfromSearch = !this.service.isOwnProfile;
   }
   const userid = sessionStorage.getItem("userid");
   
   if(this.userdetail[0].followers.indexOf(userid) > -1){
         this.isfollowing = true;
   }
  
  }


logout(){
  sessionStorage.clear();
  this.router.navigate(['/login']);
}
storefile(event:any){
  this.file = event.target.files[0];
  this.showsave = true;
  this.showupload = false;
}
setprofilepic(){
   //const file = event.target.files[0];
  console.log(this.file); 
   const id = sessionStorage.getItem("userid");
      const formdata = new FormData();
      formdata.append("image",this.file);
      formdata.append("userid",id);
  
      this.service.storeimage(formdata).subscribe(
      {
        next:(data)=>{
          console.log(data);

          this.file="";
        window.location.reload();
          
        },
        error:(error)=>{
            alert("something went wrong")
        }
      }
      )
}

getimage(userid:any){
  
  this.service.getimage(userid).subscribe(
    {
      next:(data)=>{
         // console.log(data);
          if(data!=null || data!=undefined){
            var thumb = Buffer.from(data.image.data).toString('base64');
            this.profileimgurl = "data:"+data.image.contentType+""+";base64,"+thumb;
          }
      },
      error:(error)=>{
         alert("something went wrong")
      }
    }
  )
}

followActivity(){
  const userid = sessionStorage.getItem("userid");
  this.service.savefollowactivity(userid,this.userdetail[0].userid).subscribe({
    next:(data)=>{
       console.log(data);
       if(data=="activity saved"){
         alert("following")
       }
    },
    error:(error)=>{   
     alert("Something Went Wrong");
    }
  })

  // this.service.addFollower(userid,this.userdetail[0]._id).subscribe({
  //   next:(data)=>{
  //     if(data=="follower added"){
  //       alert("you are following now ")
  //     }
  //   },
  //   error:(error)=>{
  //     alert("Something Went Wrong");
  //   }
  // })
}
}
