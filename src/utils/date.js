export default class Time {
   constructor(date) {
      this.now = new Date();
      this.past = new Date(date);
      this.difference = this.now.getTime() / 1000 - this.past.getTime() / 1000;
      this.hour = Math.floor(this.difference / 3600);
      this.diff = this.difference - this.hour * 3600;
      this.minute = Math.floor(this.diff / 60);
      this.day = Math.floor(this.hour / 24);
      this.week = Math.floor(this.day / 7);
      this.month = Math.floor(this.week / 4.345);
      this.year = Math.floor(this.month / 12);
   }

   getNormalRt() {
      if (this.year > 0) {
         return this.year === 1 ? "a year ago" : `${this.year} years ago`;
      }

      if (this.month > 0) {
         return this.month === 1 ? "a month ago" : `${this.month} months ago`;
      }

      if (this.week > 0) {
         return this.week === 1 ? "a week ago" : `${this.week} weeks ago`;
      }

      if (this.day > 0) {
         return this.day === 1 ? "a day ago" : `${this.day} days ago`;
      }

      if (this.hour > 0) {
         return this.hour === 1 ? "an hour ago" : `${this.hour} hours ago`;
      }

      if (this.minute > 0) {
         return this.minute === 1
            ? "a minute ago"
            : `${this.minute} minutes ago`;
      }

      return "Just now";
   }
}
