import { Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from '../Services/profile.service';
import { Buffer } from 'buffer';
import { JsonPipe, ViewportScroller } from '@angular/common';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild('moreoption') moreoption: ElementRef;
  @ViewChild('moreoption1') moreoption1: ElementRef;
  @ViewChild('moreoption2') moreoption2: ElementRef;
  @ViewChild('moremenus') moremenus: ElementRef;
  @ViewChild('backopt') backopt: ElementRef;
  @ViewChild('myInput')
seletedfile: ElementRef;
  
  showmoredropdown = false;
  liked = false;
  showbookmark = false
  homeoptionselected=true;
  profilepageselected = false;
  Searchpageselected = false;
  AccountName = ""
  showsearchbox = false;
  profilepicurl = "../assets/defaultprofilepic.png";
  defaultpicurl = "../assets/defaultprofilepic.png"
  Allusers:Array<{userid:string,username:string,imgurl:string}> = [];
  Allusersfilter:Array<{userid:string,username:string,imgurl:string}> = [];
  mode = "Dark Mode"
  isdark = false;
  switchappearance = false;
  profilepageforsearch = false;
  file:any
  showloader = false;
showsave:boolean = false;
showupload:boolean = true;
instantuploadedimgurl:string=''
caption=''
likes=0
commentedby=''
comment=''
  constructor(private router:Router,private renderer:Renderer2,private service:ProfileService,private scroller:ViewportScroller){
    this.renderer.listen('window', 'click',(e:Event)=>{
   
     if( e.target !== this.moreoption?.nativeElement && e.target !== this.moreoption1?.nativeElement && e.target !== this.moreoption2?.nativeElement && e.target!==this.moremenus?.nativeElement){
         this.showmoredropdown=false;
     }

    
     var userdetails = JSON.parse(sessionStorage.getItem("userdetails"));
    
 });
  }
  ngOnInit(): void {
    const userid = sessionStorage.getItem("userid");
    this.getimage(userid);

    var userdetails = JSON.parse(sessionStorage.getItem("userdetails"));
    if(userdetails==null || userdetails==undefined){
        this.router.navigate(["/login"])
     }else{

    this.AccountName = userdetails?.username;
    //this.spinner.show();
    this.showloader = true;
    this.service.getallusers(userid).subscribe(
     { next:(data)=>{
          for(let d of data){
           // console.log(d._id);
            
            this.service.getimage(d._id).subscribe(
              {
                next:(data1)=>{
                 // console.log(data1);
                    if(data1!=null && data1!=undefined && data1!="not found"){
                      var thumb = Buffer.from(data1.image.data).toString('base64');
                      var url = "data:"+data1.image.contentType+""+";base64,"+thumb;
                      this.Allusers.push({userid:d._id,username:d.username,imgurl:url});
                    }else{
                      this.Allusers.push({userid:d._id,username:d.username,imgurl:this.defaultpicurl});
                    }
                    //this.spinner.hide();
                    this.showloader = false;
                },
                error:(error)=>{
                 // this.spinner.hide();
                  this.showloader = false;
                   alert("something went wrong")
                }
              }
            )
          }
         // this.spinner.hide();
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
  }
  showmore(){
    this.showmoredropdown = !this.showmoredropdown;
  }
  logout(){
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  showswitchappearance(){
    this.showmoredropdown = false;
    this.switchappearance = true;
  }

  like(){
    this.liked = !this.liked;
  }
  bookmark(){
    this.showbookmark = !this.showbookmark;
  }

  showprofilepage(){
    const userid = sessionStorage.getItem("userid");
    this.openuserprofile(userid);
  }
  showhomepage(){
    this.scroller.scrollToPosition([0,0]);
    this.homeoptionselected = true;
    this.profilepageselected = false;
    this.Searchpageselected = false;
    this.showsearchbox = false;
    this.profilepageforsearch = false;
  }

  getimage(userid:any){
    //const userid = sessionStorage.getItem("userid");
    this.service.getimage(userid).subscribe(
      {
        next:(data)=>{
           // console.log(data);
            if(data!='not found' && data!=null && data!=undefined){
              var thumb = Buffer.from(data.image.data).toString('base64');
              this.profilepicurl = "data:"+data.image.contentType+""+";base64,"+thumb;
            }
        },
        error:(error)=>{
           alert("something went wrong")
        }
      }
    )
  }

  changemode(){

    if(this.mode=="Dark Mode"){
       this.mode = "Light Mode";
      }else{
       this.mode = "Dark Mode";
    }
    this.isdark = !this.isdark;
  }
  back(){
   this.showmoredropdown = true;
   this.switchappearance = false;
  }

  showsearch(){
    this.showsearchbox = !this.showsearchbox
    this.Searchpageselected = true;
  }

  filterUser(event:any){

    this.Allusersfilter = []
    var search = event.target.value;

   if(search=="") return;
    this.Allusers.forEach(item =>{
      if( item.username.toLowerCase().indexOf(search.toLowerCase())>=0) this.Allusersfilter.push({userid:item.userid,username:item.username,imgurl:item.imgurl});
    });
      
  }

  openuserprofile(userid:any){

    //this.spinner.show();
    this.showloader = true;
    this.Allusersfilter = []
    this.profilepageforsearch = false;
    //console.log(userid+" user");
    this.service.getuserdetails(userid).subscribe({
      next:(data)=>{
        // console.log(JSON.stringify(data) +" details");
       // console.log(JSON.stringify(data)+" getting data");
        
         this.service.setuserdetails(data);
         this.showsearchbox = false;
         this.homeoptionselected = false;
         this.profilepageforsearch = true;
         this.Searchpageselected = false;
         this.showsearchbox = false;
         this.profilepageselected = false;

        //  setTimeout(()=>{
         // this.spinner.hide();
         this.showloader = false;
        //  },3000)
      },
      error:(error)=>{
        //this.spinner.hide();
        this.showloader = false;
        alert("Something Went Wrong");
      }
    })
  }

  storefile(event:any){
    this.file = event.target.files[0];
    this.showupload = false;
    this.showsave = true;
   
  }

  Uploadpostimage(){

   
    const reader = new FileReader();
      reader.readAsDataURL(this.file); 
      reader.onload = (_event) => { 
          this.instantuploadedimgurl = reader.result.toString();          
        }

        this.showsave = false;
        this.showupload = true;
      
  }


  create(){
    this.showsave=false;
    this.showupload = true;
    this.instantuploadedimgurl = '';

  }

  createpost(){

    const id = sessionStorage.getItem("userid");
    const formdata = new FormData();
    formdata.append("image",this.file);
    formdata.append("userid",id); 
    formdata.append("caption",this.caption);
    // formdata.append("likes",this.likes.toString());
    // formdata.append("commentedby",this.commentedby);
    // formdata.append("comment",this.comment);
    this.service.saveposts(formdata).subscribe({
      next:(data)=>{
          if(data=='post saved'){
            alert("Successfully posted")
             
          }
         //console.log(data);
      },
      error:(error)=>{
     //   this.spinner.hide();
        alert("Something Went Wrong");
      }
    })
  }
}
