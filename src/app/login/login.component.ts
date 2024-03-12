import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { LoginsignupService } from '../Services/loginsignup.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {

  email:any
  password:any;
  showloader = false;
  constructor(private service:LoginsignupService,private router:Router,private spinner: NgxSpinnerService){
    if(sessionStorage.getItem("isLoggedIn")!=null && sessionStorage.getItem("isLoggedIn")=="true"){
      this.router.navigate(["/home"]);
   }
  }
  ngOnInit(): void {
   
  }
  login(){
    //this.spinner.show();
    this.showloader = true;
    if(this.email=='' || this.password==''){
      alert("Please fill all details")
      return
    }
    this.service.checkuser(this.email,this.password).subscribe(
      {
        next:(data)=>{
          
          if(data._id!=null){
            sessionStorage.setItem("userid",data._id);
            sessionStorage.setItem("userdetails", JSON.stringify(data));
           // this.spinner.hide();
           this.showloader = false;
           sessionStorage.setItem("isLoggedIn","true");
           this.router.navigate(["/home"]);
          }else{
          //  this.spinner.hide();
          this.showloader = false;
            alert(data)
          }  
        } ,
        error:(error)=>{
         this.spinner.hide();
          alert("Something went wrong")
        }
        }
    )
  }
  
}
