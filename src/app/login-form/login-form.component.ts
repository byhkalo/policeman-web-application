import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent {
  loginForm = this.fb.group({
    email: [null, Validators.email],
    password: [null, Validators.required]
  });

  hasUnitNumber = false;


  constructor(private fb: FormBuilder) {}

  onSubmit() {
    alert('Thanks!');
  }
}
