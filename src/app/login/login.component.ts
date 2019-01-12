import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  host: {'class':'col-xl-12'},
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  alertText = '';
  emailValue: string = '';
  passwordValue: string = '';

  loginForm = this.fb.group({
    email: [null, Validators.email],
    password: [null, Validators.required]
  });
  constructor(private authService: AuthService, private router: Router, private fb: FormBuilder) { }
  
  ngOnInit() {
  }

  loginAction() {
    this.alertText = ''
    console.log("e = "+ this.emailValue)
    console.log("p = "+ this.passwordValue)
    this.authService.logInWithEmailAndPassword(this.emailValue, this.passwordValue).subscribe(firebaseUser => {
      console.log("Completions")
      if (firebaseUser != null) {
        console.log("Success")
        this.alertText = 'success!';
        this.router.navigate(['profile']);
      } else {
        console.log("Fail")
        this.alertText = 'Error Try Again';
      }
    })
  }

}
