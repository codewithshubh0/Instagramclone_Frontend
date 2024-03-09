import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { LoginsignupService } from '../Services/loginsignup.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  email:any
  password:any;

  constructor(private service:LoginsignupService,private router:Router,private spinner: NgxSpinnerService){}
  login(){
    this.spinner.show();
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
            this.spinner.hide();
           this.router.navigate(["/home"]);
          }else{
            this.spinner.hide();
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
