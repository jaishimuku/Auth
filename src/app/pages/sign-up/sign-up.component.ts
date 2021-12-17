import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent implements OnInit {
  fname: string = '';
  lname: string = '';
  email: string = '';
  password: string = '';
  message = '';

  // Validation Err
  errorMsg = '';

  // For firebase error handlings
  error: { name: string; message: string } = { name: '', message: '' };

  constructor(private authservice: AuthService, private router: Router) {}

  ngOnInit(): void {}

  clearErrorMessage() {
    this.errorMsg = '';
    this.error = { name: '', message: '' };
  }

  signup() {
    this.clearErrorMessage();
    if (this.validateForm(this.email, this.password)) {
      this.authservice
        .registerWithEmail(this.email, this.password)
        .then(() => {
          this.message = 'Your credentials has been registered to Firebase';
        })
        .then(() => {
          this.router.navigate(['/sign-in']);
        })
        .catch((_error) => {
          this.error = _error;
          this.router.navigate(['/sign-up']);
        });
    }
  }

  validateForm(email: string, password: string) {
    if (email.length === 0) {
      this.errorMsg = 'please enter email id';
      return false;
    }

    if (password.length === 0) {
      this.errorMsg = 'please enter password';
      return false;
    }

    if (this.fname.length === 0) {
      this.errorMsg = 'please enter First Name';
      return false;
    }

    if (this.lname.length === 0) {
      this.errorMsg = 'please enter Last Name';
      return false;
    }

    if (password.length < 6) {
      this.errorMsg = 'password should be at least 6 char';
      return false;
    }

    this.errorMsg = '';
    return true;
  }
}
