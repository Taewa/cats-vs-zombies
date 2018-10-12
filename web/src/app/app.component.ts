import {Component, OnInit} from '@angular/core';
import {Http} from "@angular/http";
import "rxjs/add/operator/map";
import {forkJoin} from "rxjs/observable/forkJoin";

interface Character {
    name: string;
    icon: string;
    attack: number;
    defense: number;
    life: number;
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    apiCat = "http://test.hr.gwapit.in:9081/api/cat/";
    apiZombie = "http://test.hr.gwapit.in:9081/api/zombie/";

    // listData = [];

    catsOriginal = [];
    zomsOriginal = [];

    cats = [];
    zoms = [];

    attObj;

    attackers = 'cats';

    currentAttackers = [];
    currentDefensers = [];

    turnOverAttackers = [];
    turnOverDefenders = [];

    deadCats = [];
    deadZoms = [];

    turnNum = 0;

    constructor(private http: Http) {
    }


    ngOnInit() {
        this.getData().subscribe((res) => {
            // const cat = res[0].json();
            // const zom = res[1].json();
            // const list = cat.concat(zom);
            // this.listData = list;

            this.cats = res[0].json();
            this.zoms = res[1].json();

            this.catsOriginal = res[0].json();
            this.zomsOriginal = res[1].json();

            this.checkDisabledCharacter();
            this.gamePlay();
        });
    }

    getData() {
        const cat = this.getCat();
        const zombie = this.getZombie();

        return forkJoin([cat, zombie]);
    }

    getCat() {
        return this.http.get(this.apiCat);
    }

    getZombie() {
        return this.http.get(this.apiZombie);
    }

    gamePlay() {
        this.setAttackStrategy();
        this.attackStart();
    }

    setAttackStrategy() {
        let atPArr = [];
        let atArr = [];
        let idx;

        const isCatsAttacker = this.attackers === 'cats';

        this.currentAttackers = isCatsAttacker ? this.cats : this.zoms;
        this.currentDefensers = isCatsAttacker ? this.zoms : this.cats;


        this.currentAttackers.forEach((cat) => {
            const at = cat.attack;


            this.currentDefensers.forEach((zom) => {
                const df = zom.defense;

                let res = at - df;
                res = res > 0 ? res : 0;

                atArr.push({
                    name: cat.name,
                    atP: res,
                    tarName: zom.name,
                    attacked: null
                });

            });
        });


        atPArr = atArr.map((obj) => obj.atP);
        idx = atPArr.indexOf(Math.max.apply(Math, atPArr));

        this.attObj = atArr[idx];
    }


    attackStart() {
        let isGameOver = false;
        const attackerName = this.attObj.name;
        const targetName = this.attObj.tarName;
        const atP = this.attObj.atP;

        const target = this.currentDefensers.filter((defenser) => {
            return defenser.name === targetName;
        })[0];

        console.log(`${attackerName} attacks ${targetName}.`);

        target.life -= atP;

        console.log(`${targetName} has ${target.life} life left.`);

        if (target.life <= 0) {
            isGameOver = this.dead(targetName);
        }

        if (isGameOver) {
            this.gameOver();
        } else {
            this.afterAttack();
        }


    }

    afterAttack() {
        this.turnOverAttackers.push(this.attObj.name);
        this.turnOverDefenders.push(this.attObj.tarName);


        this.attackDone();

    }

    attackDone() {

        this.checkDisabledCharacter();

        console.log('Attack is done ------------------------------------------------');

        if (this.currentAttackers.length === 0 || this.currentDefensers.length === 0) {
            this.turnOver();
        } else {
            this.gamePlay();

        }

    }


    checkDisabledCharacter() {
        const isCatsAttacker = this.attackers === 'cats';
        let disabledCats = isCatsAttacker ? this.turnOverAttackers : this.turnOverDefenders;
        let disabledZoms = isCatsAttacker ? this.turnOverDefenders : this.turnOverAttackers;

        disabledCats = disabledCats.concat(this.deadCats);
        disabledCats = Array.from(new Set(disabledCats));

        disabledZoms = disabledZoms.concat(this.deadZoms);
        disabledZoms = Array.from(new Set(disabledZoms));

        this.cats = this.catsOriginal.filter((cat) => {
            return disabledCats.indexOf(cat.name) === -1;
        });

        this.zoms = this.zomsOriginal.filter((zom) => {
            return disabledZoms.indexOf(zom.name) === -1;
        });

        if (isCatsAttacker) {
            this.currentAttackers = this.cats;
            this.currentDefensers = this.zoms;
        } else {
            this.currentAttackers = this.zoms;
            this.currentDefensers = this.cats;
        }

    }

    turnOver() {
        ++this.turnNum;

        console.log('Turn is over. Exchange atttack and defense !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        console.log(`TURN : ${this.turnNum}`);

        this.turnOverAttackers = [];
        this.turnOverDefenders = [];
        this.currentAttackers = [];
        this.currentDefensers = [];

        this.attackers === 'cats' ? this.attackers = 'zoms' : this.attackers = 'cats';
        this.checkDisabledCharacter();
        this.gamePlay();

    }

    dead(name) {
        const isCatsAttacker = this.attackers === 'cats';
        isCatsAttacker ? this.deadZoms.push(name) : this.deadCats.push(name);

        console.warn(`${name} is dead..............................................`);

        return this.checkGameOver();
    }

    checkGameOver() {
        if (this.deadCats.length === this.catsOriginal.length || this.deadZoms.length === this.zomsOriginal.length) {
            return true;
        } else {
            return false;
        }
    }

    gameOver() {
        console.log('GameOver!!');
    }

}
