class communicationFactory {

  constructor() {
    'ngInject';
    this.shareStoredData = {};
    this.subscriptions = [];
  }

  registerCallbackFunc(subscribedEvents, callback, context) {
    this.subscriptions.push({
      eventNames: subscribedEvents,
      callbackFunc: callback,
      context: context
    });
  }

  notifyChange(broadcastEvent, value) {
    this.subscriptions.forEach((subscription) => {
      if (subscription.eventNames.indexOf(broadcastEvent) > -1) {
        subscription.callbackFunc(broadcastEvent, value);
      }
    })
  }

  unRegister(context) {
    this.subscriptions.some((subscription, index, thisArray) => {
      if (subscription.context === context) {
        thisArray.splice(index, 1);
        return true;
      }
    })
  }

  getSharedData(){
    return this.shareStoredData;
  }

  setSharedData(data){
    this.shareStoredData = data;
  }

  static communicationFunctions() {
    return new communicationFactory();
  }

}

export default communicationFactory;