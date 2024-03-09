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
Userposts:Array<{userid:string,username:string,posturl:string,imagename:string,postcaption:string,likes:Number,commentdata:{username:string,commenttext:string}}> = [];
openimgurl = ''
imagename = ''
showloader = false;
instantuploadedimgurl:string=''
caption=''
likes= 0;
commentedby=''
comment=''
postcaption=''
constructor(private router:Router,private service:ProfileService,private scroller:ViewportScroller,private spinner:NgxSpinnerService){  
          this.onload();
      }
  
ngOnInit(): void {
   this.scroller.scrollToPosition([0,0])
  }

  onload(){
    this.Userposts = []
    const userid = sessionStorage.getItem("userid");
    this.userdetail = this.service.getdetails();
  //  this.spinner.show();
  this.showloader = true;
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
              this.post = this.userdetail[0].posts?.length;
             // this.spinner.show();
             this.showloader = true; 
             for(let i=this.userdetail[0]?.posts.length-1;i>=0;i--){
                 var thumb = Buffer.from(this.userdetail[0]?.posts[i]?.image?.data).toString('base64');
                 var url = "data:"+this.userdetail[0]?.posts[i]?.image?.contentType+""+";base64,"+thumb;
                 this.Userposts.push(
                  {
                    userid:this.userdetail[0]?.userid,
                    username:this.userdetail[0]?.username,
                    posturl:url,
                    imagename:this.userdetail[0]?.posts[i]?.name,
                    postcaption:this.userdetail[0]?.posts[i]?.postcaption,
                    likes:this.userdetail[0]?.posts[i]?.likes,
                    commentdata: this.userdetail[0]?.posts[i]?.comments
                 }
                 );
                 if(i==0) {
                  //this.spinner.hide();
                  this.showloader = false; 
                }
              }    
             }     
            
               if(this.userdetail[0]?.followers?.indexOf(userid) > -1){
                  this.isfollowing = true;
               }
            }
  
              //this.spinner.hide();
              this.showloader = false; 
        
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
   //this.spinner.show();
  this.showloader = true;
   console.log(this.file); 
   const id = sessionStorage.getItem("userid");
      const formdata = new FormData();
      formdata.append("image",this.file);
      formdata.append("userid",id);
  
      this.service.storeimage(formdata).subscribe(
      {
        next:(data)=>{
          console.log(data);
         // this.spinner.hide();
         this.showloader = false;
         this.file="";
        window.location.reload();
          
        },
        error:(error)=>{
          this.showloader = false;
          //this.spinner.hide();
            alert("something went wrong")
        }
      }
      )
}

getimage(userid:any){
  //this.spinner.show();
  this.showloader = true;
  this.service.getimage(userid).subscribe(
    {
      next:(data)=>{
         // console.log(data);
       
          if(data!='not found' && data!=null && data!=undefined){
            var thumb = Buffer.from(data.image.data).toString('base64');
            this.profileimgurl = "data:"+data.image.contentType+""+";base64,"+thumb;
          }
          //this.spinner.hide();
          this.showloader = false;
        },
      error:(error)=>{
        //this.spinner.hide();
        this.showloader = false;
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
  //this.spinner.show();
  this.showloader = true;
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
      // this.spinner.hide();
      this.showloader = false;
    },
    error:(error)=>{   
      //this.spinner.hide();
      this.showloader = false;
     alert("Something Went Wrong");
    }
  })

}

Uploadpostimage(){

  this.instantuploadedimgurl = ''
  const reader = new FileReader();
    reader.readAsDataURL(this.file); 
    reader.onload = (_event) => { 
        this.instantuploadedimgurl = reader.result.toString(); 
    }
 this.showsave = false;
 this.showupload = true;
}


createpost(){

  const id = sessionStorage.getItem("userid");
  const formdata = new FormData();
  formdata.append("image",this.file);
  formdata.append("userid",id); 
  formdata.append("caption",this.caption);
  formdata.append("likes",this.likes.toString());
  formdata.append("commentedby",this.commentedby);
  formdata.append("comment",this.comment);
  this.service.saveposts(formdata).subscribe({
    next:(data)=>{
        if(data=='post saved'){
          alert("Successfully posted")
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
   this.imagename = post.imagename;
   this.postcaption = post.postcaption;
  
   console.log(this.openimgurl);
   
}

deletepost(imagename:any){
 // this.spinner.show();
 this.showloader = true; 
 const id = sessionStorage.getItem("userid");
  this.service.deleteposts(id,imagename).subscribe({
    next:(data)=>{
        if(data=='post deleted'){
           alert("Successfully Deleted");
           this.onload();
           //this.spinner.hide();
         this.showloader = false;
          }
       console.log(data);
    },
    error:(error)=>{
      //this.spinner.hide();
      this.showloader = false;
      alert("Something Went Wrong");
    }
  })
}

create(){
  this.showsave=false;
  this.showupload = true;
  this.instantuploadedimgurl = '';

}
}
