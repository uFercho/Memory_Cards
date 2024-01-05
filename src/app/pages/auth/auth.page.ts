import { Component, OnInit, inject } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { ValidatorsService } from 'src/app/shared/services/validators.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { User } from 'src/app/models/user.interface';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  private fb = inject( FormBuilder );
  private validatorsService = inject( ValidatorsService );
  private utils = inject(UtilsService);

  public myForm: FormGroup = this.fb.group({
    name: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern(this.validatorsService.namePattern)
      ]
    ],
  });

  constructor( ) {
  }

  ngOnInit() {
  }

  getControl( field: string ): FormControl {
    return this.myForm.controls[field] as FormControl;
  }

  isValidField( field: string ): boolean | null {
    return this.validatorsService.isValidField( this.myForm, field );
  }

  getFieldError( field: string ): string | null {
    if ( !this.myForm.controls[field] ) return null;

    const errors = this.myForm.controls[field].errors || {}

    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es requerido';
        case 'minlength':
          return `Mínimo ${errors['minlength'].requiredLength } caracteres`;
        case 'pattern':
          return 'Este campo solo puede tener letras';
      }
    }
    return null
  }

  onSubmit(): void {
    if ( this.myForm.invalid ) return;

    const user: User = {
      name: this.myForm.controls['name'].value,
      dificultad: 'medio',
      puntos: 0,
      max: 0
    }

    this.utils.setUser = user;
    this.utils.routerLink('/main/home')

    this.utils.toast({
      message: `Bienvenido ${user.name}`,
      duration: 1500,
      color: 'primary',
      icon: 'checkmark-circle-outline',
    })

    this.myForm.reset();
  }

}
