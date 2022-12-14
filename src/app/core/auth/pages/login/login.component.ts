import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup
  loginCount:number =0;
  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router,
    private messageService:MessageService,private primengConfig: PrimeNGConfig) { }

  ngOnInit(): void {
    this.createLoginForm();
    this.primengConfig.ripple = true;
  }

  createLoginForm() {
    this.loginForm = this.formBuilder.group({
      userName: ['',Validators.required],
      password: ['',Validators.required],
    });
  }

  login() {
    console.log(this.loginForm)
    if(!this.loginForm.valid){
      this.messageService.add({detail:'Username and password cannot be left blank.',key:'etiya-warn'})
      return
    }
    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        this.loginCount =0;
        console.log(response)
        setTimeout(() => {          
          this.router.navigateByUrl('showcase')         
        }, 1000);
      },error:(err) =>{
        this.loginCount +=1;
        console.log(this.loginCount)
        if (this.loginCount == 3) {          
          this.messageService.add({detail:'The password was entered incorrectly 3 times.',key:'etiya-warn'})
        }
        else{
          this.messageService.add({detail:'Wrong Username or Password.Please try again',key:'etiya-warn'})
        }        
      }
    });
  }

  forgotPassword(){
    this.messageService.add({detail:'Please contact your system administrator'
    ,severity:'info',summary:'Forgot password?',key:'etiya-custom',sticky:true})  
  }

  IsPropertyInvalid(name:string){
    return this.loginForm.get(name)?.touched && this.loginForm.get(name)?.hasError('required')
  }

}
