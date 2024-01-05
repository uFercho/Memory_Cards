import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'shared-custom-input',
  templateUrl: './custom-input.component.html',
  styleUrls: ['./custom-input.component.scss'],
})
export class CustomInputComponent  implements OnInit {

  @Input({ required: true }) control!: FormControl;
  @Input({ required: true }) type!: string;
  @Input({ required: true }) label!: string;
  @Input() autocomplete!: string;
  @Input() icon?: string;


  constructor() { }

  ngOnInit() {}

}
