export class NotificationAPI {
    static granted = false;
    static notifications = {};

    static async request() {
        let res = await Notification.requestPermission();
        if (res === "granted") this.granted = true;
        return {success: this.granted, res};
    }

    static sendNotification(title, body = '', icon = '/assets/grasshopper.png', tag = 'grasshopper-api', data = {}) {
        if (this.granted) {
            let notification = new Notification(title, {body, icon, data, tag});
            this.notifications[tag] = notification;
            return {success: true, notification};
        } else return {success: false, notification: undefined};
    }
}