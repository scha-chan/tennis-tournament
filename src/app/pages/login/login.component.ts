import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms/src/model';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'game-login',
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent {
    public form:FormGroup;
    public loading = false;

    constructor(
        private fb:FormBuilder, 
        private auth: LoginService, 
        private router: Router
    ) {
        localStorage.removeItem('token');    
        localStorage.removeItem('user');        
        this.form = this.fb.group({
            email: ['',Validators.required],
            password: ['',Validators.required]
        });
    }

    login() {
        const val = this.form.value;  
        this.loading = true;      
        if (val.email && val.password) {
            this.auth.login(val.email, val.password)
                .subscribe(
                    () => {
                        this.loading = false;
                        console.log("User is logged in");
                        this.router.navigateByUrl('/');
                    }
                );
        } else {
            this.loading = false;     
        }
    }
}
