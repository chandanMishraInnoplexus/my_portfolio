class HomeCtrl {

    constructor($rootScope, $scope, $stateParams, communication) {
        'ngInject';
        this.$rootScope = $rootScope;
        this.$scope = $scope;
        this.$stateParams = $stateParams;
        this.slideIndex = 0;
        this.styleSlider = { margin: 0 };
    }

    $onInit() {
        let self = this;
        self.sortType = 'name'; // set the default sort type
        self.sortReverse = false;  // set the default sort order
        self.searchFish = '';     // set the default search/filter term
    };
    //self.reelSlider(0, true);

    reelSlider(iIndex) {
        if (iIndex == 1) {
            if (this.slideIndex < 6)
                this.slideIndex++;
        } else if (iIndex == -1) {
            if (this.slideIndex != 0)
                this.slideIndex--;
        }
        this.marginCalc(this.slideIndex);
    }

    marginCalc(iIndex) {
        let tot = 0;
        tot = iIndex * 50;
        this.styleSlider.margin = tot * -1;
    }
}


let homeObj = {
    bindings: {},
    templateUrl: './scripts/home/home.html',
    controller: HomeCtrl,
    controllerAs: 'home'
}

export default homeObj;
