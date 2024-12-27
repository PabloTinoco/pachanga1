import { Component,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { GroupService } from '../../services/group.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { CourtService } from '../../services/court.service';



@Component({
  selector: 'app-add-group',
  templateUrl: './add-group.component.html',
  styleUrl: './add-group.component.less',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule]
})
export class AddGroupComponent implements OnInit {
  groupForm!: FormGroup;
  courtId!: string;
  court_name!: string;

  constructor(
    private fb: FormBuilder,
    private groupService: GroupService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private courtService: CourtService,
  ) {}

  ngOnInit(): void {
    this.courtId = this.route.snapshot.paramMap.get('courtId')!;
    this.courtService.getCourtById(this.courtId).subscribe((court) => {
      this.court_name = court.name;
    });
    this.groupForm = this.fb.group({
      name: ['', Validators.required],
      status: ['', Validators.required],
    });
  }
  onSubmit(): void {
    if (this.groupForm.valid) {
      const groupData = {
        ...this.groupForm.value,
        court_id: this.courtId,
      };
      this.groupService.createGroup(groupData).subscribe({
        next: (data: any) => {
          this.snackBar.open('Registration successful!', 'Close', {
            duration: 3000,
          });
          this.router.navigate(['/groups', this.courtId]);
        },
        error: (data: any) => {
          this.snackBar.open('Registration failed. Please try again.', 'Close', {
            duration: 3000,
          });
        }
      });
    }
  }
}
