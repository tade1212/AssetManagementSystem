import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../core/services/user';

@Component({
  selector: 'app-user-manager',
  standalone: false,
  templateUrl: './user-manager.html',
  styleUrl: './user-manager.scss',
})
export class UserManagerComponent implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  searchQuery: string = '';

  isEditMode = false;
  editingUserId: number | null = null;

  // UI needs these specific names
  newUser = { fullName: '', email: '', roleId: 3 };
  userForm = { fullName: '', email: '', roleId: 3 };
  password = '';

  constructor(
    private userService: UserService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe((data) => {
      this.users = data;
      this.applyFilter();
    });
  }

  applyFilter() {
    this.filteredUsers = this.users.filter(
      (u) =>
        u.fullName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(this.searchQuery.toLowerCase()),
    );
    this.cdr.detectChanges();
  }

  // Combined function to handle both "newUser" and "userForm"
  addUser() {
    this.saveUser();
  }

  saveUser() {
    const data = this.isEditMode ? this.userForm : this.newUser;

    if (this.isEditMode && this.editingUserId) {
      this.userService.updateUser(this.editingUserId, data).subscribe(() => {
        alert('User updated!');
        this.resetForm();
        this.loadUsers();
      });
    } else {
      this.userService.createUser(data, this.password).subscribe(() => {
        alert('User created!');
        this.resetForm();
        this.loadUsers();
      });
    }
  }

  editUser(user: any) {
    this.isEditMode = true;
    this.editingUserId = user.id;
    this.userForm = { fullName: user.fullName, email: user.email, roleId: user.roleId };
  }

  deleteUser(id: number) {
    if (confirm('Delete this user?')) {
      this.userService.deleteUser(id).subscribe(() => this.loadUsers());
    }
  }

  resetForm() {
    this.isEditMode = false;
    this.editingUserId = null;
    this.newUser = { fullName: '', email: '', roleId: 3 };
    this.password = '';
  }

  close() {
    this.router.navigate(['/home']);
  }
  goBack() {
    this.router.navigate(['/home']);
  }
  resetPassword(user: any) {
    const newPassword = prompt(`Enter new password for ${user.fullName}:`);
    if (newPassword && newPassword.length >= 6) {
      this.userService.resetPassword(user.id, newPassword).subscribe({
        next: () => alert('Password has been updated successfully!'),
        error: (err) => alert('Failed to reset password.'),
      });
    } else if (newPassword) {
      alert('Password must be at least 6 characters.');
    }
  }
}
