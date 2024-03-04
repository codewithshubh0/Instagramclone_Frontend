import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { LoginsignupService } from '../Services/loginsignup.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  email:any
  password:any;

  constructor(private service:LoginsignupService,private router:Router){}
  login(){
    this.service.checkuser(this.email,this.password).subscribe(
      {
        next:(data)=>{
          
          if(data._id!=null){
            sessionStorage.setItem("userid",data._id);
            sessionStorage.setItem("userdetails", JSON.stringify(data));
            this.router.navigate(["/home"]);
          }else{
            alert(data)
          }  
        } ,
        error:(error)=>{
          alert("Something went wrong")
        }
        }
    )
  }
  
}
