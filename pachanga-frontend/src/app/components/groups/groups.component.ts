import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { GroupService } from '../../services/group.service';
import { CourtService } from '../../services/court.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.less'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class GroupsComponent implements OnInit {
  groups: any[] = [];
  courtId!: string;
  court_name!: string;

  constructor(private route: ActivatedRoute, private groupService: GroupService, private courtService: CourtService, private router: Router) {}

  ngOnInit(): void {
    this.courtId = this.route.snapshot.paramMap.get('courtId')!;
    this.groupService.getGroupsByCourt(this.courtId).subscribe((groups) => {
      this.groups = groups;
    });
    this.courtService.getCourtById(this.courtId).subscribe((court) => {
      this.court_name = court.name;
    });
  }

  goToCreateGroup(): void {
    this.router.navigate([`/add-group/${this.courtId}`]);
  }

}
