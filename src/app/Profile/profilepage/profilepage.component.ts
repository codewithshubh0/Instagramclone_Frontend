import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from 'src/app/Services/profile.service';
import { Buffer } from 'buffer';
import { ViewportScroller } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
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
editprofilepage = false;
profilehomepage = true;
gender = ['Male','Female','Prefer not to say']
savebiotext=''
biodata:String[] = [];
Userposts:Array<{userid:string,username:string,posturl:string}> = [];
openimgurl = ''
constructor(private router:Router,private service:ProfileService,private scroller:ViewportScroller,private spinner:NgxSpinnerService){  
          this.onload();
      }
  
ngOnInit(): void {
   this.scroller.scrollToPosition([0,0])
  }

  onload(){
    const userid = sessionStorage.getItem("userid");
    this.userdetail = this.service.getdetails();
    this.spinner.show();
     if(this.userdetail!=null && this.userdetail!=undefined){
           this.isfromSearch = (userid!=this.userdetail[0]?.userid);
            this.getimage(this.userdetail[0]?.userid);
            
              this.AccountName = this.userdetail[0]?.username;
              this.follower = this.userdetail[0]?.followers?.length;
              this.following = this.userdetail[0]?.followings?.length;
              this.bio = this.userdetail[0]?.bio 
                         
              this.biodata = this.bio?.split("-");
    
              
  
             this.savebiotext = this.bio?.replaceAll("-", "\n");
             if(this.userdetail[0]?.posts[0]?.image!=null && this.userdetail[0]?.posts[0]?.image!=undefined){
        
              this.spinner.show();
              for(let i=this.userdetail[0]?.posts.length-1;i>=0;i--){
                 var thumb = Buffer.from(this.userdetail[0]?.posts[i]?.image?.data).toString('base64');
                 var url = "data:"+this.userdetail[0]?.posts[i]?.image?.contentType+""+";base64,"+thumb;
                 this.Userposts.push({userid:this.userdetail[0]?.userid,username:this.userdetail[0]?.username,posturl:url});
                 if(i==0) {
                  this.spinner.hide();
                 }
              }    
             }     
            
               if(this.userdetail[0]?.followers?.indexOf(userid) > -1){
                  this.isfollowing = true;
               }
            }
  
              this.spinner.hide();
        
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
   this.spinner.show();
  console.log(this.file); 
   const id = sessionStorage.getItem("userid");
      const formdata = new FormData();
      formdata.append("image",this.file);
      formdata.append("userid",id);
  
      this.service.storeimage(formdata).subscribe(
      {
        next:(data)=>{
          console.log(data);
          this.spinner.hide();
          this.file="";
        window.location.reload();
          
        },
        error:(error)=>{
          this.spinner.hide();
            alert("something went wrong")
        }
      }
      )
}

getimage(userid:any){
  this.spinner.show();
  this.service.getimage(userid).subscribe(
    {
      next:(data)=>{
         // console.log(data);
       
          if(data!='not found' && data!=null && data!=undefined){
            var thumb = Buffer.from(data.image.data).toString('base64');
            this.profileimgurl = "data:"+data.image.contentType+""+";base64,"+thumb;
          }
          this.spinner.hide();
      },
      error:(error)=>{
        this.spinner.hide();
         alert("something went wrong")
      }
    }
  )
}

follow(){
  const userid = sessionStorage.getItem("userid");
  this.service.savefollowactivity(userid,this.userdetail[0].userid).subscribe({
    next:(data)=>{
       console.log(data);
       if(data=="activity saved"){
        this.isfollowing = true;
        this.follower++;
        //  alert("following");     
       }
    },
    error:(error)=>{   
     alert("Something Went Wrong");
    }
  })
}

unfollow(){
  const userid = sessionStorage.getItem("userid");
  this.service.Unfollowuser(userid,this.userdetail[0].userid).subscribe({
    next:(data)=>{
       console.log(data);
       if(data=="activity saved"){
        this.isfollowing = false;
        this.follower--;
        //  alert("unfollowed");     
       }
    },
    error:(error)=>{   
     alert("Something Went Wrong");
    }
  })
}

editprofile(){
  this.profilehomepage = false
   this.editprofilepage = true;
}

editprofilesubmit(){
  this.spinner.show();
  const userid = sessionStorage.getItem("userid");
 
  var reg = new RegExp(/(\r\n?|\n|\t)/g);
  var bio = this.savebiotext.replace(reg, "-");
  //console.log(bio+" save");
  this.service.savebio(userid,bio).subscribe({
    next:(data)=>{
      // console.log(data);
       if(data=="bio saved"){
       alert("Profile Updated")
        //  alert("unfollowed");     
       }
       this.spinner.hide();
    },
    error:(error)=>{   
      this.spinner.hide();
     alert("Something Went Wrong");
    }
  })

}

Uploadpostimage(){

  const id = sessionStorage.getItem("userid");
  const formdata = new FormData();
  formdata.append("image",this.file);
  formdata.append("userid",id);
 
  this.service.saveposts(formdata).subscribe({
    next:(data)=>{
        if(data=='post saved'){
           alert("Successfully Posted");
           this.onload();
        }
       console.log(data);
    },
    error:(error)=>{
   //   this.spinner.hide();
      alert("Something Went Wrong");
    }
  })

}

openpost(post:any){
   this.openimgurl = post.posturl;
   console.log(this.openimgurl);
   
}

}
