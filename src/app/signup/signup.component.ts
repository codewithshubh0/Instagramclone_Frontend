import { Component } from '@angular/core';
import { LoginsignupService } from '../Services/loginsignup.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { HostListener } from "@angular/core";
import emailjs, { type EmailJSResponseStatus } from '@emailjs/browser';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  email:any
  fullname:any
  username:any
  password:any;
  screenHeight: number;
  screenWidth: number;
  mobileview = false;
   constructor(private service:LoginsignupService,private router:Router,private spinner: NgxSpinnerService){
    this.getScreenSize();
   }
  
   @HostListener('window:resize', ['$event'])
    getScreenSize(event?) {
          this.screenHeight = window.innerHeight;
          this.screenWidth = window.innerWidth;

          if(this.screenWidth<500){
            this.mobileview = true;
          }else{
            this.mobileview = false
          }
    }
   signup(){
    this.spinner.show();

    if(this.email=='' || this.fullname=='' || this.password=='' || this.username=='') {
      alert("Please fill all details")
      return
    }
      this.service.createuser(this.email,this.fullname,this.username,this.password).subscribe({
        next:(data)=>{

          if(data=="1"){
            alert("User Sucessfully Created");
            //this.sendmail(this.fullname,this.email)
            this.spinner.hide();
            this.router.navigate(["/login"]);
          }else{
            this.spinner.hide();
            alert(data);
          }
            
        },
        error:(error)=>{
          this.spinner.hide();
          alert("something went wrong");
        }
      })
  }

  async sendmail(fullname,email){
    emailjs.init("rYrzzDbs-2U3DdD6h")
   let response = await emailjs.send("service_idlugib","template_rniu8go",{
      from_name: "Anjani Sharma",
      to_name: fullname,
      message: "welcome "+fullname +", Start Exploring My Istagram world. Thank you for Joining",
      reply_to: email
    });

  }
}
