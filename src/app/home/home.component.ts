import { Component, ElementRef, Inject, OnInit, Renderer2, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from '../Services/profile.service';
import { Buffer } from 'buffer';
import { JsonPipe, ViewportScroller } from '@angular/common';
import { HostListener } from "@angular/core";
import { DatePipe } from '@angular/common';
import { NgxSpinnerService} from 'ngx-spinner';

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
  screenHeight: number;
  fetchingdata = false;
  screenWidth: number;
  navbarformobile = false;
  suggestionsforMobile = false;
  homepageformobile = false;
  mobileview = false;
  usercomment = ''
  showpost = false

  postuseridfordelcomment:any
  imagenamefordelcomment:any
  commentfordel:any
  indextodel:number
  
 isOwnPost = false;
  useridtofetch = '';
  imagenametofetch = '';
  indextofetch = -1;
  count=0;
  page = -1;
  totallength = 0;
  searchselectedformobile = false;
  Randomposts:Array<{index:number,userid:string,username:string,profileurl:string,posturl:string,imagename:string,postcaption:string,likes:number,commentdata:Array<{username:any,imageurl:any,commenttext:any,iscurrentusercomment:boolean}>,ageofpost:string,postdate:string,todaypostage:string,liked:boolean,istodayspost:boolean}> = [];
  postmodaltempdata:{index:number,userid:string,username:string,profileurl:string,posturl:string,imagename:string,postcaption:string,likes:number,ageofpost:string,postdate:string,todaypostage:string,liked:boolean,istodayspost:boolean}
  commentdetails:Array<{username:any,imageurl:any,commenttext:any,iscurrentusercomment:boolean}> = []
  commentdetailsformodalpost:Array<{username:any,imageurl:any,commenttext:any,iscurrentusercomment:boolean}> = []
  constructor(private router:Router,private renderer:Renderer2,private service:ProfileService,private scroller:ViewportScroller,private datepipe:DatePipe,private spinner:NgxSpinnerService){
    this.renderer.listen('window', 'click',(e:Event)=>{
        if( e.target !== this.moreoption?.nativeElement && e.target !== this.moreoption1?.nativeElement && e.target !== this.moreoption2?.nativeElement && e.target!==this.moremenus?.nativeElement){
            this.showmoredropdown=false;
        }
    });
 this.getScreenSize();

//  this.scroller.scrollToPosition([0,0]);
  }
  ngOnInit(): void {
    this.service.gettotalpostcount().subscribe({
      next:(data)=>{
        this.totallength = data;
      },
      error:(error)=>{ 
        
      }
    })
    this.Allusers = []
    this.showloader = true;

    
    const userid = sessionStorage.getItem("userid");
    this.getimage(userid);

    if(sessionStorage.getItem("isLoggedIn")==null || sessionStorage.getItem("isLoggedIn")==undefined || sessionStorage.getItem("isLoggedIn")=="false" ){
      this.showloader = false;
        this.router.navigate(["/login"])
     }else{
      var userdetails = JSON.parse(sessionStorage.getItem("userdetails"));
    this.AccountName = userdetails?.username;
    //this.spinner.show();
    if(this.Allusers?.length==0){
      this.service.getallusers(userid).subscribe(
        { next:(data)=>{
             for(let d of data){
               this.service.getimage(d._id).subscribe(
                 {
                   next:(data1)=>{
   
                       if(data1!=null && data1!=undefined && data1.image!=null){
                         var thumb = Buffer.from(data1.image.data).toString('base64');
                         var url = "data:"+data1.image.contentType+""+";base64,"+thumb;
                         this.Allusers.push({userid:d._id,username:d.username,imgurl:url});
                       }else{
                         this.Allusers.push({userid:d._id,username:d.username,imgurl:this.defaultpicurl});
                       }
                       //this.showloader = false;
                   },
                   error:(error)=>{
                     this.showloader = false
                      alert("something went wrong")
                   }
                 }
               )
             }
             setTimeout(() => {
               this.showloader = false;
             },3000);
            
        },
        error:(error)=>{
         this.showloader = false;
        }
       }
       )
    }
    

  
    // this.scroller.scrollToPosition([0,0]);
    this.homeoptionselected = true;
    this.usercomment = ''
    this.showpost = false
    //this.onloadhomepage()
    this.onScroll();
  
    
  }
  }


  @HostListener('window:resize', ['$event'])
    getScreenSize(event?) {
          this.screenHeight = window.innerHeight;
          this.screenWidth = window.innerWidth;

          if(this.screenWidth<500){
            this.suggestionsforMobile = true;
            this.navbarformobile = true;
            this.homepageformobile = true;
            this.mobileview = true;
          }else{
            this.suggestionsforMobile = false;
            this.navbarformobile = false;
            this.homepageformobile = false;
            this.mobileview = false
          }
    }

    sortData() {
      return this.Randomposts.sort((a, b) => {
        return <any>new Date(b.postdate) - <any>new Date(a.postdate);
      });
    }
    calculateDiff(dateSent){
      let currentDate = new Date();
      dateSent = new Date(dateSent);
   
       return Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(dateSent.getFullYear(), dateSent.getMonth(), dateSent.getDate()) ) /(1000 * 60 * 60 * 24));
     }

     onloadhomepage(){
     // this.Randomposts = []
      this.showloader=true
      this.spinner.show();
      const loggeduserid = sessionStorage.getItem("userid");
 if(this.Randomposts?.length==0){

   
    this.service.getalluserdetails().subscribe({
       next:(data)=>{
           if(data){
            
            for(let dat of data){
              
              const userid = dat?.userid;
              const username = dat?.username;
              
              const profileurl = this.defaultpicurl
              for(let post of dat?.posts){
                var thumb = Buffer.from(post?.image?.data).toString('base64');
                var url = "data:"+post?.image?.contentType+""+";base64,"+thumb;
                const imgname = post?.name;
                const postcaption = post?.postcaption
                const likes = post?.likes.length;

                var postingdate = this.datepipe.transform(post.postdate, 'yyyy-MM-dd hh:mm a')
               var agedate  = this.calculateDiff(postingdate);
              // console.log(agedate);
               
              // var agedate = this.calculateDiff(this.datepipe.transform('Mon Jan 08 2024 20:10:27 GMT+0530 (India Standard Time)', 'yyyy-MM-dd hh:mm'));
                var ageofpost = ''
                var todaypostage = ''
                var todaypost = false;
                if(agedate==0 ){
                    //calculate time diff
                    todaypost = true;
                    var currdate = new Date()
                    var timediff = currdate.getTime()-new Date(post.postdate).getTime();
                   // console.log((timediff/1000)/60+" minutes");
                    todaypostage = Math.floor(timediff/1000)>=0 && Math.floor(timediff/1000)<60?Math.floor(timediff/1000)+'s':
                             Math.floor(timediff/1000)>=60 && Math.floor(timediff/1000)<3600?Math.floor((timediff/1000)/60)+'m':
                             Math.floor(((timediff/1000)/60)/60)+'h';
                    
               }else
               
               if(agedate>0 && agedate<=30){
                  ageofpost = (agedate)+'d' 
               }
               else if(agedate>30 && agedate<365){
                   ageofpost = Math.floor(agedate/7)+'w' 
               }else if(agedate>365){
                    ageofpost = Math.floor(agedate/365)+'y'
               }

               const id = sessionStorage.getItem("userid");
               var isliked = false;
                  post.likes.forEach(item =>{
                    if( item.indexOf(id)>=0){
                      isliked = true;
                    }
                  });
              
                this.commentdetails = [] 
                if(post?.comments!=null && post?.comments!=undefined){
                    for(let cmt of post?.comments){

                     const commentprofileimg =  this.defaultpicurl
                      this.commentdetails.unshift({username:cmt.username,imageurl:commentprofileimg,commenttext:cmt.commenttext,iscurrentusercomment:(cmt.userid==loggeduserid)});    
                    }
                }

                 this.Randomposts.unshift({index:this.Randomposts.length,userid:userid,username:username,profileurl:this.defaultpicurl,posturl:url,imagename:imgname,postcaption:postcaption,likes:likes,commentdata:this.commentdetails,ageofpost:ageofpost,postdate:postingdate,todaypostage:todaypostage,liked:isliked,istodayspost:todaypost});
                }
                
            }
            setTimeout(()=>{
              this.showloader = false;
              this.spinner.hide();
            },6000)
           }
       },
       error:(error)=>{
         this.showloader = false
         this.spinner.hide();
       }
    })
   }else{
    


    this.sortData().forEach((obj)=>{
     


       var postingdate = this.datepipe.transform(obj.postdate, 'yyyy-MM-dd hh:mm a')
       var agedate  = this.calculateDiff(postingdate);
      // console.log(agedate);
       
      // var agedate = this.calculateDiff(this.datepipe.transform('Mon Jan 08 2024 20:10:27 GMT+0530 (India Standard Time)', 'yyyy-MM-dd hh:mm'));
        var ageofpost = ''
        var todaypostage = ''
        var todaypost = false;
        if(agedate==0 ){
            //calculate time diff
            todaypost = true;
            var currdate = new Date()
            var timediff = currdate.getTime()-new Date(obj.postdate).getTime();
           // console.log((timediff/1000)/60+" minutes");
            todaypostage = Math.floor(timediff/1000)>=0 && Math.floor(timediff/1000)<60?Math.floor(timediff/1000)+'s':
                     Math.floor(timediff/1000)>=60 && Math.floor(timediff/1000)<3600?Math.floor((timediff/1000)/60)+'m':
                     Math.floor(((timediff/1000)/60)/60)+'h';
            
       }else if(agedate>0 && agedate<=30){
          ageofpost = (agedate)+'d' 
       }
       else if(agedate>30 && agedate<365){
           ageofpost = Math.floor(agedate/7)+'w' 
       }else if(agedate>365){
            ageofpost = Math.floor(agedate/365)+'y'
       }
  
       obj.ageofpost = ageofpost
       obj.todaypostage = todaypostage;
       obj.postdate = postingdate
       obj.istodayspost = todaypost;

    })
    this.spinner.hide();
    this.showloader = false;
     
   }
    
     }

     savelikes(userid:string,imagename:string,index:number){
    this.useridtofetch = userid;
    this.imagenametofetch = imagename;
    this.indextofetch = index;
      this.showloader = true;
      const id = sessionStorage.getItem("userid");
      this.service.savelikes(userid,imagename,id).subscribe({
        next:(data)=>{
        //  console.log("like saved");
        if(data){
       
              this.sortData()[index].likes++;
              this.sortData()[index].liked = true;

        }
     this.showloader = false;
        },
        error:(error)=>{
          this.showloader = false;
           alert("something went wrong");
        }
      })
    }

    dislike(userid:any,imagename:any,index:number){
      this.useridtofetch = userid;
    this.imagenametofetch = imagename;
    this.indextofetch = index;
      this.likes--;
    this.showloader = true;
      const id = sessionStorage.getItem("userid");
      this.service.savedislikes(userid,imagename,id).subscribe({
        next:(data)=>{
        //  console.log("like saved");
          if(data){
            // this.router.navigate(['/home'])
            // window.location.reload();
            // if(this.postmodaltempdata!=undefined && this.postmodaltempdata!=null){
            //     this.postmodaltempdata.likes--;
            //     this.postmodaltempdata.liked = false;
            // }
           // this.ngOnInit();

          //  this.Randomposts[index].likes = this.Randomposts[index].likes - 1;
       //   console.log(this.Randomposts[index].likes+" before like at "+index);


               this.Randomposts.map((el,ind)=>{
                 if(ind==index){
                    el.likes--;
                    el.liked = false;
                 }
               })
              // this.Randomposts[index].likes++;
              // this.Randomposts[index].liked = true;

            //  console.log(this.Randomposts[index].likes+" after like at "+index);
           

          
           
          }
          this.showloader = false;
        },
        error:(error)=>{
          this.showloader = false;
           alert("something went wrong");
        }
      })
    }
    
  showmore(){
    this.showmoredropdown = !this.showmoredropdown;
  }
  logout(){
    sessionStorage.clear();
    sessionStorage.setItem("isLoggedIn","false")
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
    this.searchselectedformobile = false
    this.ngOnInit()
  }

  getimage(userid:any){
    //const userid = sessionStorage.getItem("userid");
    this.service.getimage(userid).subscribe(
      {
        next:(data)=>{
           // console.log(data);
            if(data!=null && data.image!=null){
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
//for returning the url
getprofileimageforposts(userid:any):string{
  //const userid = sessionStorage.getItem("userid");
  var urlofprofile = "../assets/defaultprofilepic.png";
  this.service.getimage(userid).subscribe(
    {
      next:(data)=>{
         // console.log(data);

            var thumb = Buffer.from(data.image.data).toString('base64');
          urlofprofile = "data:"+data.image.contentType+""+";base64,"+thumb;
          
      },
      error:(error)=>{
         alert("something went wrong")
      }
    }
    
  )
  return urlofprofile;
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
         this.searchselectedformobile = false

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
   this.caption = ''
  }

  createpost(){

    const id = sessionStorage.getItem("userid");
    const formdata = new FormData();
    var currdate = this.datepipe.transform(new Date(), 'yyyy-MM-dd hh:mm a')
    
    var posturl='';
    const reader = new FileReader();
    reader.readAsDataURL(this.file); 
    reader.onload = (_event) => { 
       posturl =  reader.result.toString();          
      }


    formdata.append("image",this.file);
    formdata.append("userid",id); 
    formdata.append("caption",this.caption);
    formdata.append("postdate",currdate);
    formdata.append("username",this.AccountName);
    // formdata.append("commentedby",this.commentedby);
    // formdata.append("comment",this.comment);
    this.service.saveposts(formdata).subscribe({
      next:(data)=>{
        alert(data)
       // this.ngOnInit();
       this.Randomposts.unshift({index:this.Randomposts.length,userid:id,username:this.AccountName,profileurl:this.defaultpicurl,posturl:posturl,imagename:this.file.name,postcaption:this.caption,likes:0,commentdata:[],ageofpost:'1d',postdate:currdate,todaypostage:'5s',liked:false,istodayspost:true});
      },
      error:(error)=>{
     //   this.spinner.hide();
        alert("Something Went Wrong");
      }
    })
  }

  openpostmodal(postdata:any,index:number){
   // this.postmodaltempdata.posturl = postdata?.posturl
   this.commentdetailsformodalpost = []
  // console.log(postdata);
  postdata.index = index;
   this.postmodaltempdata = postdata
   this.commentdetailsformodalpost = postdata.commentdata
   const id = sessionStorage.getItem("userid");
   this.isOwnPost = postdata.userid==id
    // this.postmodaltempdata.username = postdata?.username;
    // this.postmodaltempdata.likes = postdata?.likes
    // this.postmodaltempdata.profileurl = postdata?.profileurl
    // this.postmodaltempdata.postcaption = postdata?.postcaption
    // this.postmodaltempdata.imagename = postdata?.imagename
    // this.postmodaltempdata.username = postdata?.username
  }


  deletepost(imagename:any){
    // this.spinner.show();
    this.showloader = true; 
    const id = sessionStorage.getItem("userid");
     this.service.deleteposts(id,imagename).subscribe({
       next:(data)=>{
           if(data=='post deleted'){
              alert("Successfully Deleted");
            //  this.ngOnInit()

            this.sortData().forEach((el,ind)=>{
              if(el.imagename==imagename){
                 
                 this.sortData().splice(ind,1);
               //  console.log(JSON.stringify(this.commentdetailsformodalpost)+" getting");
              }
           })


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

  postcomment(postuserid:any,imagename:any,index:number){


    console.log(index+" this index");
    
    this.showloader = true;
    const id = sessionStorage.getItem("userid");
    this.service.addcomment(postuserid,id,imagename,this.usercomment).subscribe({
      next:(data)=>{
        //  console.log("like saved");
          if(data){
  
  
            this.service.getimage(id).subscribe(
              {
                next:(data)=>{
                    if(data!=null && data.image!=null){
                      var thumb = Buffer.from(data.image.data).toString('base64');
                      var imgurl = "data:"+data.image.contentType+""+";base64,"+thumb;
                     // this.commentdetailsformodalpost.unshift({username:data.username,imageurl:imgurl,commenttext:this.usercomment,iscurrentusercomment:true})
                      
                      this.sortData()[index].commentdata.unshift({username:data.username,imageurl:imgurl,commenttext:this.usercomment,iscurrentusercomment:true})
                     
                    //  this.ngOnInit();
                      this.usercomment = "";
                    }else{
                     // this.commentdetailsformodalpost.unshift({username:data.username,imageurl:this.defaultpicurl,commenttext:this.usercomment,iscurrentusercomment:true})
                      this.sortData()[index].commentdata.unshift({username:data.username,imageurl:this.defaultpicurl,commenttext:this.usercomment,iscurrentusercomment:true})
                   //   this.ngOnInit();
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
  opendeletecommentmodal(postuserid:any,imagename:any,comment:any,index:number){
  this.postuseridfordelcomment = postuserid;
  this.imagenamefordelcomment = imagename;
  this.commentfordel = comment;
  this.indextodel = index;
  }

  deletecomment(postuserid:any,imagename:any,comment:any,index){
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
             var tempdata = this.commentdetailsformodalpost;
             
          // this.commentdetailsformodalpost = tempdata.splice(tempdata.findIndex(item=>{item.commenttext == comment}),1);          
           
            this.sortData()[this.indextodel].commentdata.forEach((el,ind)=>{
               if(el.commenttext==comment){
                  
                  this.sortData()[this.indextodel].commentdata.splice(ind,1);
                //  console.log(JSON.stringify(this.commentdetailsformodalpost)+" getting");
               }
            })
           // this.ngOnInit()
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
  addcomment(){
    // console.log(this.usercomment+" comment");
     
     if(this.usercomment!=null && this.usercomment!=undefined && this.usercomment.length>0){
       this.showpost = true;
     }else{
       this.showpost = false;
     }
   }


   reportpopup(){
    alert("Comment Reported")
   }

   showsearchformobile(){
    this.scroller.scrollToPosition([0,0]);
    this.searchselectedformobile = true;
    this.homeoptionselected  = false;
    this.profilepageselected = false;
    this.profilepageforsearch = false;
   }

  onScroll(){
    this.page++;
    this.commentdetails = [] 
    if(this.page>this.totallength) return;
    //console.log("scrolled "+ this.page);
    this.fetchingdata = true;
    this.spinner.show();
    const loggeduserid = sessionStorage.getItem("userid");
   
    this.service.getuserpostbypage(this.page).subscribe({
      next:(data)=>{
          if(data){
           
           for(let dat of data){
            this.commentdetails = [] 
             this.service.getimage(dat?.userid).subscribe(
              {
                next:(data)=>{
                  //  console.log(data.name);
                    
                      var thumb = Buffer.from(data.image.data).toString('base64');
                      var url1 = "data:"+data.image.contentType+""+";base64,"+thumb;
                      profileurl = url1;
   
                      const userid = dat?.userid;
                      const username = dat?.username;
         
                      var profileurl = ''
                        var thumb = Buffer.from(dat?.image?.data).toString('base64');
                        var url = "data:"+dat?.image?.contentType+""+";base64,"+thumb;
                        const imgname = dat?.postname;
                        const postcaption = dat?.postcaption
                        const likes = dat?.likes.length;
         
                        var postingdate = this.datepipe.transform(dat.postdate, 'yyyy-MM-dd hh:mm a')
                       var agedate  = this.calculateDiff(postingdate);
         
                        var ageofpost = ''
                        var todaypostage = ''
                        var todaypost = false;
                        if(agedate==0 ){
                            //calculate time diff
                            todaypost = true;
                            var currdate = new Date()
                            var timediff = currdate.getTime()-new Date(dat.postdate).getTime();
                           // console.log((timediff/1000)/60+" minutes");
                            todaypostage = Math.floor(timediff/1000)>=0 && Math.floor(timediff/1000)<60?Math.floor(timediff/1000)+'s':
                                     Math.floor(timediff/1000)>=60 && Math.floor(timediff/1000)<3600?Math.floor((timediff/1000)/60)+'m':
                                     Math.floor(((timediff/1000)/60)/60)+'h';
                            
                       }else
                       
                       if(agedate>0 && agedate<=30){
                          ageofpost = (agedate)+'d' 
                       }
                       else if(agedate>30 && agedate<365){
                           ageofpost = Math.floor(agedate/7)+'w' 
                       }else if(agedate>365){
                            ageofpost = Math.floor(agedate/365)+'y'
                       }
         
                       const id = sessionStorage.getItem("userid");
                       var isliked = false;
                          dat.likes.forEach(item =>{
                            if( item.indexOf(id)>=0){
                              isliked = true;
                            }
                          });
    
                          this.commentdetails = [] 
                            for(let cmt of dat?.postcomments){

                              this.showloader = true;
                                this.service.getimage(cmt.userid).subscribe(
                                  {
                                    next:(data)=>{
                                      // console.log(data);
                                    
                                        if(data!=null && data.image!=null){
                                          var thumb = Buffer.from(data.image.data).toString('base64');
                                          var commentprofileurl = "data:"+data.image.contentType+""+";base64,"+thumb;
                                          this.commentdetails.unshift({username:data?.username,imageurl:commentprofileurl,commenttext:cmt.commenttext,iscurrentusercomment:(cmt.userid==loggeduserid)});    
                                         }else{
                                          this.commentdetails.unshift({username:data?.username,imageurl:this.defaultpicurl,commenttext:cmt.commenttext,iscurrentusercomment:(cmt.userid==loggeduserid)})
                                         }

                                         
                                         this.showloader=false;
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
                        
                    
                    
                        this.Randomposts.push({index:this.Randomposts.length,userid:userid,username:username,profileurl:url1,posturl:url,imagename:imgname,postcaption:postcaption,likes:likes,commentdata:this.commentdetails,ageofpost:ageofpost,postdate:postingdate,todaypostage:todaypostage,liked:isliked,istodayspost:todaypost});
                     
                      //this.showloader = false;
                },
                error:(error)=>{
                  this.showloader = false
                   alert("something went wrong")
                }
              }
            )
               
           }
           this.fetchingdata = false;
             this.showloader = false;
             this.spinner.hide();
           
          }
      },
      error:(error)=>{
        this.fetchingdata = false;
        this.showloader = false
        this.spinner.hide();
      }
   })
   }

}
