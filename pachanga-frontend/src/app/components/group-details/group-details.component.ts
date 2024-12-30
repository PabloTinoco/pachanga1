import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GroupService } from '../../services/group.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-group-details',
  imports: [CommonModule],
  templateUrl: './group-details.component.html',
  styleUrl: './group-details.component.less',
  standalone: true
})
export class GroupDetailsComponent implements OnInit {

  group: any;

  constructor(
    private route: ActivatedRoute,
    private groupService: GroupService
  ) {}

  ngOnInit(): void {
    const group_id = this.route.snapshot.paramMap.get('group_id');
    if (group_id) {
      this.groupService.getGroupDetails(group_id).subscribe((data) => {
        this.group = data;
      });
    }
  }

}
