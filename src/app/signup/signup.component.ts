import { Component } from '@angular/core';
import { LoginsignupService } from '../Services/loginsignup.service';
import { Router } from '@angular/router';
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

   constructor(private service:LoginsignupService,private router:Router){}
  
   signup(){
      this.service.createuser(this.email,this.fullname,this.username,this.password).subscribe({
        next:(data)=>{

          if(data=="1"){
            alert("User Sucessfully Created");
            this.router.navigate(["/login"]);
          }else{
            alert(data);
          }
            
        },
        error:(error)=>{
          alert("something went wrong");
        }
      })
  }
}
