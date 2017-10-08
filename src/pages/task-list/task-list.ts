import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {ModalController} from 'ionic-angular';
import {FilterPage} from './filter-add';
import * as _ from 'lodash';

import {TaskDataService} from '../../services/task_service';

@IonicPage({
    name: "task-list",
})
@Component({
    selector: 'page-task-list',
    templateUrl: 'task-list.html',
    providers: [TaskDataService],
})
export class TaskListPage {

    parentTasks: Array<any>
    matchingTasks: Array<any>
    task: any = {};
    searchBarInput: string = '';
    hasBeenFiltered: boolean = false;
    searchQuery: string = '';

    constructor(public navCtrl: NavController, public navParams: NavParams, public taskDataService: TaskDataService, public modalCtrl: ModalController) {
    }

    resetTaskList() {
        this.searchQuery = '';
        Promise.all([
            this.taskDataService.getAllParentTasks().then((res) => {
                let ptasks = _.orderBy(res.object, ["startTime"], ["asc"]);
                ptasks = ptasks.filter((task) => {
                    return task.taskState !== 'COMPLETED';
                });
                this.parentTasks = ptasks;
            }, (error) => {
                console.warn("All task list could not be retrieved", error)
            })
        ]);
        this.hasBeenFiltered = false;
    }

    presentModal() {
        let modal = this.modalCtrl.create('filter-add', {searchBarInput: this.searchBarInput});
        modal.onDidDismiss(taskData => {
            Promise.all([
                this.taskDataService.getFilteredTasks(taskData).then((res) => {
                    this.parentTasks = _.orderBy(res.object, ["assessment", "task.startTime"], ["desc", "asc"])
                    this.hasBeenFiltered = true;
                }, (error) => {
                    console.warn("All task list could not be retrieved", error)
                })
            ]);
        });
        modal.present();
    }

    openFilters() {
        this.navCtrl.push('filter-add');
    }

    ionViewDidEnter() {
        this.doRefresh();
    }


    async onSearchBarInput(ev: any) {
        let val = ev.target.value;
        let task = this.task;
        JSON.stringify(task);
        task.query = val;
        this.searchBarInput = val;
        await Promise.all([
            this.taskDataService.getFilteredTasks(task).then((res) => {
                this.parentTasks = _.orderBy(res.object, ["assessment", "task.startTime"], ["desc", "asc"])
            }, (error) => {
                console.warn("All task list could not be retrieved", error)
            })
        ])
    }

    async doRefresh(refresher = null) {
        this.hasBeenFiltered = false;
        await Promise.all([
            this.taskDataService.getMatchingTasks(5).then((res) => {
                this.matchingTasks = _.orderBy(res.object, ["assessment", "task.startTime"], ["desc", "asc"])
            }, (error) => {
                console.warn("Matching tasks could not be retrieved", error)
            }),
            this.taskDataService.getAllParentTasks().then((res) => {
                let ptasks = _.orderBy(res.object, ["startTime"], ["asc"]);
                ptasks = ptasks.filter((task) => {
                    return task.taskState !== 'COMPLETED';
                });
                this.parentTasks = ptasks;
            }, (error) => {
                console.warn("All task list could not be retrieved", error)
            })
        ]);

        //Stop the ion-refresher from spinning
        if (refresher) {
            refresher.complete()
        }
    }


}
