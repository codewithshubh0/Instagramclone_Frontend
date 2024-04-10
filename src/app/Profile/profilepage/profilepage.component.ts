import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from 'src/app/Services/profile.service';
import { Buffer } from 'buffer';
import { ViewportScroller } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { HostListener } from "@angular/core";
import { DatePipe } from '@angular/common';
import {  ModalDirective} from 'ngx-bootstrap/modal';
import * as bootstrap from "bootstrap";
import * as $ from 'jquery';
@Component({
  selector: 'app-profilepage',
  templateUrl: './profilepage.component.html',
  styleUrls: ['./profilepage.component.css']
})
export class ProfilepageComponent implements OnInit {
  @ViewChild('openpostmodal') public modal: ModalDirective;
profileimgurl = "../assets/defaultprofilepic.png";
  defaultpicurl = "../assets/defaultprofilepic.png"
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
Userposts:Array<{userid:string,username:string,posturl:string,imagename:string,postcaption:string,likes:[],commentdata:Array<{commentuserid:string,username:any,imageurl:any,commenttext:any}>}> = [];
commentarray:Array<{userid:any,commenttext:any}> = []
commentdetails:Array<{commentuserid:string,username:any,imageurl:any,commenttext:any}> = []
openimgurl = ''
imagename = ''
showloader = false;
instantuploadedimgurl:string=''
caption=''
likes= 0;
commentedby=''
comment=''
postcaption=''
postuserid= ''
usercomment = ''
showpost = false
liked = false;
screenHeight: number;
screenWidth: number;
homepageformobile = false;
mobileview = false;
showloaderforcommentload = false
postuseridfordelcomment:any
imagenamefordelcomment:any
commentfordel:any
hidepostmodal = false;
editprofilepageformobile = false
constructor(private router:Router,private service:ProfileService,private scroller:ViewportScroller,private spinner:NgxSpinnerService,private datepipe:DatePipe){  
          this.onload();
          this.getScreenSize();
      }
  
ngOnInit(): void {
   this.scroller.scrollToPosition([0,0])
  }
  @HostListener('window:resize', ['$event'])
    getScreenSize(event?) {
          this.screenHeight = window.innerHeight;
          this.screenWidth = window.innerWidth;

          if(this.screenWidth<500){
            this.mobileview = true;
            this.homepageformobile = true;
          }else{
            this.mobileview = false;
            this.homepageformobile = false;
          }
    }

    // openuserprofile(userid:any){

    //   //this.spinner.show();
    //   this.Userposts = []
    //   //console.log(userid+" user");
    //   this.service.getuserdetailsonscroll(userid,c).subscribe({
    //     next:(data)=>{
            
    //     },
    //     error:(error)=>{
    //       //this.spinner.hide();
    //       alert("Something Went Wrong");
    //     }
    //   })
    // }
  onload(){
    if(this.Userposts.length==0){

    this.Userposts = []

    const userid = sessionStorage.getItem("userid");
    this.userdetail = this.service.getdetails();
  this.showloader = true;
     if(this.userdetail!=null && this.userdetail!=undefined){
           this.isfromSearch = (userid!=this.userdetail[0]?.userid);
            this.getimage(this.userdetail[0]?.userid);
            
              this.AccountName = this.userdetail[0]?.username;
              this.follower = this.userdetail[0]?.followers?.length;
              this.following = this.userdetail[0]?.followings?.length;
              this.bio = this.userdetail[0]?.bio 
                         
              this.biodata = this.bio?.split("-");   
            //  var dd = this.datepipe.transform(new Date(), 'yyyy-MM-dd hh:mm');
            //  console.log(dd+" ff");
             
             // console.log('03/11/24 08:10'-dd>'03/11/24 07:57');
           //   console.log('03/11/24 08:10'-dd);
             this.savebiotext = this.bio?.replaceAll("-", "\n");
             if(this.userdetail[0]?.posts[0]?.image!=null && this.userdetail[0]?.posts[0]?.image!=undefined){
              this.post = this.userdetail[0].posts?.length;
             this.showloader = true; 
             for(let i=this.userdetail[0]?.posts.length-1;i>=0;i--){
                 var thumb = Buffer.from(this.userdetail[0]?.posts[i]?.image?.data).toString('base64');
                 var url = "data:"+this.userdetail[0]?.posts[i]?.image?.contentType+""+";base64,"+thumb;
                 var commentdata = []
               
                // console.log(d+" date");
                 
                   for(let j=this.userdetail[0]?.posts[i]?.comments?.length-1;j>=0;j--){
                       const commentuserid = this.userdetail[0]?.posts[i]?.comments[j]?.userid
                      const commenttext = this.userdetail[0]?.posts[i]?.comments[j]?.commenttext;

                      commentdata.push({commentuserid:commentuserid,username:commentuserid,imageurl:this.defaultpicurl,commenttext:commenttext})              
                   }
                                   
                 this.Userposts.push(
                  {
                    userid:this.userdetail[0]?.userid,
                    username:this.userdetail[0]?.username,
                    posturl:url,
                    imagename:this.userdetail[0]?.posts[i]?.name,
                    postcaption:this.userdetail[0]?.posts[i]?.postcaption,
                    likes:this.userdetail[0]?.posts[i]?.likes,
                    commentdata: commentdata
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
              this.showloader = false; 
              
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
   //this.spinner.show();
  this.showloader = true;
   //console.log(this.file); 
   const id = sessionStorage.getItem("userid");
      const formdata = new FormData();
      formdata.append("image",this.file);
      formdata.append("userid",id);
      formdata.append("username",this.AccountName);
      this.service.storeimage(formdata).subscribe(
      {
        next:(data)=>{
        //  console.log(data);
         // this.spinner.hide();
         this.showloader = false;
         this.file="";
         this.showsave = false;
         this.showupload = true;
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
       
          if(data!=null && data.image!=null){
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
      // console.log(data);
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
     //  console.log(data);
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

editprofilemobile(){
  this.profilehomepage = false
   this.editprofilepageformobile = true;
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
  var currdate = this.datepipe.transform(new Date(), 'yyyy-MM-dd hh:mm a')
  var posturl='';
  const reader = new FileReader();
  reader.readAsDataURL(this.file); 
  reader.onload = (_event) => { 
     posturl =  reader.result.toString();          
    }

  const formdata = new FormData();
  formdata.append("image",this.file);
  formdata.append("userid",id); 
  formdata.append("caption",this.caption);
  formdata.append("postdate",currdate);
  formdata.append("username",this.AccountName);
  // formdata.append("likes",this.likes.toString());
  // formdata.append("commentedby",this.commentedby);
  // formdata.append("comment",this.comment);
  this.service.saveposts(formdata).subscribe({
    next:(data)=>{
          alert(data)
        //   this.ngOnInit();
        this.Userposts.unshift({userid:id,username:this.AccountName,posturl:posturl,imagename:this.file.name,postcaption:this.caption,likes:[],commentdata:[]});
        //  console.log(data);
    },
    error:(error)=>{
   //   this.spinner.hide();
      alert("Something Went Wrong");
    }
  })
}

openpost(post:any){
  this.commentdetails = []
  this.liked = false;
   this.openimgurl = post.posturl;
   this.imagename = post.imagename;
   this.postcaption = post.postcaption;
   this.likes = post.likes.length;
   this.postuserid = post.userid;
   this.showpost = false;
   this.usercomment = ''
   

  
   for(let i=0;i<post.commentdata.length;i++){
    this.showloader = true;
      this.service.getimage(post.commentdata[i].username).subscribe(
        {
          next:(data)=>{
            // console.log(data);
          
              if(data!=null && data.image!=null){
                var thumb = Buffer.from(data.image.data).toString('base64');
                var url = "data:"+data.image.contentType+""+";base64,"+thumb;
                this.commentdetails.push({commentuserid:post.commentdata[i].commentuserid ,username:data.username,imageurl:url,commenttext:post.commentdata[i].commenttext})
               }else{
                this.commentdetails.push({commentuserid:post.commentdata[i].commentuserid,username:data.username,imageurl:this.defaultpicurl,commenttext:post.commentdata[i].commenttext})
               }
              //this.spinner.hide();
              //this.showloaderforcommentload = false;
            },
          error:(error)=>{
            //this.spinner.hide();
            this.showloader = false;
            alert("something went wrong")
          }
        }
      )
      
      
   }

   //this.showloader = false
   setTimeout(()=>{
      this.showloader = false
   },5000)

   const id = sessionStorage.getItem("userid");
    if(this.likes>0){
      post.likes.forEach(item =>{
        if( item.indexOf(id)>=0){
          this.liked = true;
        }
      });
    }  
   
   
  // console.log(this.openimgurl);
   
}


deletepost(imagename:any){
  // this.spinner.show();
  this.showloader = true; 
  const id = sessionStorage.getItem("userid");
   this.service.deleteposts(id,imagename).subscribe({
     next:(data)=>{
         if(data=='post deleted'){
            alert("Successfully Deleted");
           // this.ngOnInit()
 
           this.Userposts.forEach((el,ind)=>{
             if(el.imagename==imagename){
                
                this.Userposts.splice(ind,1);
              //  console.log(JSON.stringify(this.commentdetailsformodalpost)+" getting");
             }
          })
 
 
         let el:HTMLElement = document.getElementById('cancelpostmodal');

         el?.click();
 
         let el2:HTMLElement = document.getElementById('cancelpostmodalmobile');
         el2?.click();
            //this.spinner.hide();
          this.showloader = false;
           }
       // console.log(data);
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

savelikes(){
  
  this.showloader = true;
  const id = sessionStorage.getItem("userid");
  this.service.savelikes(this.postuserid,this.imagename,id).subscribe({
    next:(data)=>{
    //  console.log("like saved");
    if(data){
      this.liked = true;
      this.likes++;
    }
 this.showloader = false;
    },
    error:(error)=>{
      this.showloader = false;
       alert("something went wrong");
    }
  })
}

addcomment(){
 // console.log(this.usercomment+" comment");
  
  if(this.usercomment!=null && this.usercomment!=undefined && this.usercomment.length>0){
    this.showpost = true;
  }else{
    this.showpost = false;
  }
}

postcomment(){
  // var date  = new date();
  // console.log(date);
  
  this.showloader = true;
  const id = sessionStorage.getItem("userid");
  this.service.addcomment(this.postuserid,id,this.imagename,this.usercomment).subscribe({
    next:(data)=>{
      //  console.log("like saved");
        if(data){


          this.service.getimage(id).subscribe(
            {
              next:(data)=>{
                  if(data!=null && data.image!=null){
                    var thumb = Buffer.from(data.image.data).toString('base64');
                    var imgurl = "data:"+data.image.contentType+""+";base64,"+thumb;
                    this.commentdetails.unshift({commentuserid:id,username:data.username,imageurl:imgurl,commenttext:this.usercomment})
                    this.usercomment = "";
                  }else{
                    this.commentdetails.unshift({commentuserid:id,username:data.username,imageurl:this.defaultpicurl,commenttext:this.usercomment})
                    this.usercomment = "";
                  }
                },
              error:(error)=>{
                //this.spinner.hide();
                this.showloader = false;
                 alert("something went wrong")
              }
            })       

 
          this.showpost = false;
        }
        this.showloader = false;
      },
      error:(error)=>{
        this.showloader = false;
         alert("something went wrong");
      }
  })
}

dislike(){
  this.likes--;
this.showloader = true;
  const id = sessionStorage.getItem("userid");
  this.service.savedislikes(this.postuserid,this.imagename,id).subscribe({
    next:(data)=>{
    //  console.log("like saved");
      if(data){
        this.liked = false;
      }
      this.showloader = false;
    },
    error:(error)=>{
      this.showloader = false;
       alert("something went wrong");
    }
  })
}

opendeletecommentmodal(commentuserid:any,imagename:any,comment:any){
  this.postuseridfordelcomment = commentuserid
  this.imagenamefordelcomment = imagename;
  this.commentfordel = comment;
  }

  deletecomment(postuserid:any,imagename:any,comment:any){
    this.showloader = true;
    const id = sessionStorage.getItem("userid");
    this.service.deletecomment(postuserid,id,imagename,comment).subscribe({
      next:(data)=>{
        //  console.log("like saved");
          if(data=="comment deleted"){
            this.postuseridfordelcomment = '';
            this.imagenamefordelcomment = '';
            this.commentfordel = '';
             console.log(comment);
             
          // this.commentdetailsformodalpost = tempdata.splice(tempdata.findIndex(item=>{item.commenttext == comment}),1);          
           
            this.commentdetails.forEach((el,ind)=>{
               if(el.commenttext==comment){
                  
                  this.commentdetails.splice(ind,1);
                  console.log(JSON.stringify(this.commentdetails)+" getting");
               }
            })
            this.ngOnInit()
           this.showpost = false;
          }
          this.showloader = false;
        },
        error:(error)=>{
          this.showloader = false;
           alert("something went wrong");
        }
    })
  }
}
