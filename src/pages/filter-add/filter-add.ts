import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {ModalController, ViewController} from 'ionic-angular';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {TaskDataService} from '../../services/task_service';
import _ from "lodash"
import {UserDataService} from "../../services/user_service";

@IonicPage({
    name: "filter-add",
})
@Component({
    selector: 'page-filter-add',
    templateUrl: 'filter-add.html',
    providers: [TaskDataService, UserDataService],
})

export class FilterAddPage {

    hasStartTime: boolean = false;
    hasEndTime: boolean = false;
    friends: Array<any> = [];
    selectedUsers: Array<any> = [];
    task: any = {};
    startDateMin: string = '';
    startDateMax: string = '';
    endDateMin: string = '';
    endDateMax: string = '';

    constructor(public navCtrl: NavController, public params: NavParams,
                public taskDataService: TaskDataService, public userDataService: UserDataService, public toast: ToastController, public viewCtrl: ViewController,) {
    }


    toTimestamp(datestring): Number {
        if (!datestring) return
        if (!isNaN(datestring)) return datestring;
        let date = Date.parse(datestring)
        if (isNaN(date)) return
        return date
    }

    getDateString(d) {
        let tzo = -d.getTimezoneOffset(),
            dif = tzo >= 0 ? '+' : '-',
            pad = (num) => {
                let norm = Math.abs(Math.floor(num));
                return (norm < 10 ? '0' : '') + norm;
            };
        return d.getFullYear() +
            '-' + pad(d.getMonth() + 1) +
            '-' + pad(d.getDate()) +
            'T' + pad(d.getHours()) +
            ':' + pad(d.getMinutes()) +
            ':' + pad(d.getSeconds()) +
            dif + pad(tzo / 60) +
            ':' + pad(tzo % 60);
    }

    async applyFilters() {

        let startTime = this.toTimestamp(this.startDateMin);
        let endTime = this.toTimestamp(this.endDateMin);
        let friendName = this.selectedUsers;
        let friendsArray = [];


        for (let i = 0; i <= this.selectedUsers.length-1; i++) {

            friendsArray.push({
                name: friendName[i],
                value: {
                    firstName: '',
                    lastName: ''
                }
            });
        }

        let taskData = {
            query: this.params.get('searchBarInput'),
            filters: [
                {
                    "name": "DateFilter",
                    "params": [
                        {
                            name: "startDateMin",
                            value: startTime
                        },
                        {
                            name: "startDateMax",
                            value: startTime
                        },

                        {
                            name: "endDateMin",
                            value: endTime
                        },
                        {
                            name: "endDateMax",
                            value: endTime
                        }
                    ]

                },
                {
                    "name": "FriendFilter",
                    "params": friendsArray
                }
            ]
        };
        console.log('Das Objekt Taskdata', taskData);
        this.viewCtrl.dismiss(taskData);
    }


    ngOnInit() {
        let self = this;


        self.userDataService.getFriends().then(function (res) {
            self.friends = res.object
        }, function (error) {
            self.toast.create({
                message: "Freunde können nicht geladen werden: " + error.message,
                position: 'top',
                duration: 3000
            }).present();
        });
    }
}
