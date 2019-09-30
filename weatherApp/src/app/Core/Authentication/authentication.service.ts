import { Injectable } from '@angular/core';
import { DatabaseService } from '../Services/database.service';
import { User } from '../../Shared/Models/User';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private databaseService: DatabaseService) { }

  private user = new Subject<any>();
  public userObservable = this.user.asObservable();

  private readonly USERNAME = 'Username';
  private readonly SELECTEDCITIES = 'SelectedCities';

  loginUser(formData): void {
    this.databaseService.getUser(formData)
      .then((response) => {
        if (response.username != null) {
          this.user.next(response);
          localStorage.setItem(this.USERNAME, response.username);
          localStorage.setItem(this.SELECTEDCITIES, response.selectedCities);
        }
      }, err =>
        //Open dialog panel with error
        console.log(err))
  }

  logoutUser(): void {
    localStorage.removeItem(this.USERNAME);
    localStorage.removeItem(this.SELECTEDCITIES);
  }


  private getUsername() {
    return localStorage.getItem(this.USERNAME);
  }

  private getSelectedCities() {
    return localStorage.getItem(this.SELECTEDCITIES);
  }
}
