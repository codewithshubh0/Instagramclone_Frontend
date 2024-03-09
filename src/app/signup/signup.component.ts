import { Component } from '@angular/core';
import { LoginsignupService } from '../Services/loginsignup.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
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

   constructor(private service:LoginsignupService,private router:Router,private spinner: NgxSpinnerService){}
  
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
}
