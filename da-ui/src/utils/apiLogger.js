class ApiLogger {
  constructor() {
    this.listeners = new Set();
    this.maxLogs = 10;
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  logRequest(method, endpoint) {
    const log = {
      id: `${Date.now()}-${Math.random()}`,
      type: 'request',
      method: method.toUpperCase(),
      endpoint,
      timestamp: Date.now(),
    };
    this.notify(log);
  }

  logResponse(status, message, endpoint) {
    const log = {
      id: `${Date.now()}-${Math.random()}`,
      type: 'response',
      status,
      message,
      endpoint,
      timestamp: Date.now(),
    };
    this.notify(log);
  }

  logInfo(message) {
    const log = {
      id: `${Date.now()}-${Math.random()}`,
      type: 'info',
      message,
      timestamp: Date.now(),
    };
    this.notify(log);
  }

  logError(status, message) {
    const log = {
      id: `${Date.now()}-${Math.random()}`,
      type: 'error',
      status,
      message,
      timestamp: Date.now(),
    };
    this.notify(log);
  }

  notify(log) {
    this.listeners.forEach(callback => callback(log));
  }
}

export const apiLogger = new ApiLogger();

