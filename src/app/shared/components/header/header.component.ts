import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SelectMenu, valueMenu } from 'src/app/models/select-menu.interface';
import { UtilsService } from '../../services/utils.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'shared-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent  implements OnInit {

  @Input({ required: true }) public title!: string;
  @Input() public backButton?: string;
  @Input() public selectMenu: SelectMenu[] = [];

  private utils = inject(UtilsService);

  public dificultad: FormControl = new FormControl('');

  constructor() {
    this.dificultad.valueChanges
      .pipe(
        takeUntilDestroyed()
      )
      .subscribe( (dificultad: valueMenu) => {
        this.utils.setDifficulty = dificultad;
      })
  }

  ngOnInit() {
    this.dificultad.setValue(this.utils.getDifficulty);
  }

}
