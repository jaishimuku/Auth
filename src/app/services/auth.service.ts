import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { User } from '../shared/services/user';

import { NotificationService } from 'src/app/services/notification.service';
import { NotificationType } from './notification.message';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData: any; //save signed user data
  authState: any = null;
  hasVerifiedEmail = true;

  constructor(
    public afu: AngularFireAuth,
   // public authProvider: AuthProvider,
    private router: Router,
    public afs: AngularFirestore,
    public ngZone: NgZone, // Remove outside scope warning

    private notificationService: NotificationService
  ) {
    // Saving user data in localStorage when logged in and setting up null when logged out;
    this.afu.authState.subscribe((auth) => {
      if (auth) {
        this.userData = auth;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user') || '{}');
      } else {
        localStorage.setItem('user', '{}');
        JSON.parse(localStorage.getItem('user') || '{}');
      }
    });
  }

  // All firebase getData functions

  get isUserAnonymousLoggedIn(): boolean {
    return this.authState !== null ? this.authState.isAnonymous : false;
  }
  get currentUserId(): string {
    return this.authState !== null ? this.authState.uid : '';
  }

  get currentUserName(): string {
    return this.authState['email'];
  }

  get currentUser(): any {
    return this.authState !== null ? this.authState : null;
  }

  get isUserEmailLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (
      this.authState !== null &&
      !this.isUserAnonymousLoggedIn &&
      this.authState.emailVerified !== false
    ) {
      return true;
    } else {
      return false;
    }
  }

  // Return true when user's email is verified
  get isEmailVerified(): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.emailVerified !== false ? true : false;
  }


  //register user using email and password
  async registerWithEmail(email: string, password: string) {
    return this.afu
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        // send email verification
        this.SendVerificationMail();
      this.emailVerifyNotification();
       // alert('email verification has been sent. Please verify email');
        this.SetUserData(result.user);
      })
      .catch((error) => {
        window.alert(error.message);
        console.log(error);
        throw error;
      });
  }

  // Email verification when new user register
  SendVerificationMail() {
    return this.afu.currentUser
      .then((u) => u?.sendEmailVerification()) // nullable data type
      .then(() => {
       // this.router.navigate(['/sign-in']);
      });
  }

  async loginWithEmail(email: string, password: string) {
    return this.afu
      .signInWithEmailAndPassword(email, password)
      .then((user) => {
          this.authState = user;
          //checks email verification before login
          if (!user.user?.emailVerified) {
            this.VerifyEmailLogin();
            //alert('Please verify your email to login');
            this.afu.signOut();
          } else {
            this.showMessage();
            this.router.navigate(['/home']);
          }
      })
      .catch((error) => {
        console.log(error);
        throw error;
      });
  }

  SetUserData(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
    const userData: User = {
      uid: user.uid,
      email: user.email,
      // firstName: user.firstName,
      // lastName: user.lastName,
      emailVerified: user.emailVerified,
    };
    return userRef.set(userData, {
      merge: true,
    });
  }

  // Reset Forggot password
  async ForgotPassword(passwordResetEmail: any) {
    return this.afu
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        this.passWordResetNotification();
       // window.alert('Password reset email sent, check your inbox.');
        //toast
      })
      .catch((error: any) => {
        window.alert(error);
      });
  }

  async signOut() {
    this.SignOutNoti();
    return this.afu.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['/sign-in']);
    });
  }

  // TOAST
  showMessage() {
    this.notificationService.sendMessage({
      message: 'Logged In Successfully',
      type: NotificationType.success,
    });
  }

  emailVerifyNotification() {
    this.notificationService.sendMessage({
      message: 'Email verification has been sent. Please verify email',
      type: NotificationType.info,
    });
  }

  VerifyEmailLogin() {
    this.notificationService.sendMessage({
      message: 'Please verify your email',
      type: NotificationType.warning,
    });
  }

  passWordResetNotification() {
    this.notificationService.sendMessage({
      message: 'Password reset email sent, check your inbox.',
      type: NotificationType.warning,
    });
  }

  SignOutNoti() {
    this.notificationService.sendMessage({
      message: 'User Logged Out',
      type: NotificationType.success,
    });
  }
}

