// src/utils/eventBus.js
const eventBus = {
    events: {},
    emit(event, data) {
      if (this.events[event]) {
        this.events[event].forEach(cb => cb(data));
      }
    },
    on(event, callback) {
      if (!this.events[event]) {
        this.events[event] = [];
      }
      this.events[event].push(callback);
    },
    off(event, callback) {
      if (this.events[event]) {
        this.events[event] = this.events[event].filter(cb => cb !== callback);
      }
    }
  };
  
  export default eventBus;  