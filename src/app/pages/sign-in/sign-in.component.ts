import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationType } from 'src/app/services/notification.message';
import { NotificationService } from 'src/app/services/notification.service';


@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
})
export class SignInComponent implements OnInit {
  email: string = '';
  password: string = '';

  //validation err
  errorMsg = '';

  // For firebase error handlings
  error: { name: string; message: string } = { name: '', message: '' };
  notifyService: any;
  notifyS: any;

  constructor(
    private authservice: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {}

  clearErrorMessage() {
    this.errorMsg = '';
    this.error = { name: '', message: '' };
  }

  login() {
    this.clearErrorMessage();
    if (this.validateForm(this.email, this.password)) {
      this.authservice
        .loginWithEmail(this.email, this.password)
        .then(() => {
           console.log("Successful login")
        })
        .catch((_error) => {
          //this.error = _error;
          this.showMessage1();
          this.router.navigate(['/login']);
        });
    }
  }

  // login() {
  //   this.clearErrorMessage();
  //   if (this.validateForm(this.email, this.password)) {
  //     this.authservice.loginWithEmail(this.email, this.password);
  //     this.showMessage();
  //   } else {
  //    this.showMessage1();
  //   }
  // }


  showMessage() {
    this.notificationService.sendMessage({
      message: 'Logged In Successfully',
      type: NotificationType.success,
    });
  }

  showMessage1() {
    this.notificationService.sendMessage({
      message: 'Email Or Password Wrong',
      type: NotificationType.error,
    });
  }

  validateForm(email: string, password: string) {
    if (email.length === 0) {
      this.errorMsg = 'please enter email id, Try again.';
      return false;
    }

    if (password.length === 0) {
      this.errorMsg = 'please enter password';
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

