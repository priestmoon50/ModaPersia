const logRequest = (message, req, options = {}) => {
  const timestamp = new Date().toISOString();
  const { logBody = true, logParams = true, logUser = true } = options;

  const logData = {
    path: req.originalUrl || 'N/A',
    method: req.method || 'N/A',
  };

  if (logBody) {
    logData.body = req.body ? { ...req.body } : 'N/A';
  }

  if (logParams) {
    logData.params = req.params ? { ...req.params } : 'N/A';
  }

  if (logUser) {
    logData.user = req.user ? { id: req.user._id, email: req.user.email } : 'N/A';
  }

  console.log(`[${timestamp}] ${message}`, logData);
};

module.exports = logRequest;
