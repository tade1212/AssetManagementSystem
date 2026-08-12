import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: false, // ADD THIS
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    console.log('Submit button was actually clicked!'); // ADD THIS LINE
    console.log('Form Values:', this.loginForm.value); // ADD THIS LINE

    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          console.log('Login successful');
          this.router.navigate(['/home']);
        },
        error: (err) => {
          console.error('Login Error:', err); // Use console.error for visibility
          this.errorMessage = 'Invalid credentials';
        },
      });
    } else {
      console.log('Form is INVALID. Check your email format.'); // ADD THIS LINE
    }
  }
}
