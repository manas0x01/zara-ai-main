// Simple logging middleware
const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;
  const ip = req.ip || req.connection.remoteAddress;
  const userAgent = req.get('User-Agent') || 'Unknown';

  // Log request
  console.log(`[${timestamp}] ${method} ${url} - IP: ${ip}`);

  // Log user if authenticated
  if (req.user) {
    console.log(`  User: ${req.user.email} (${req.user._id})`);
  }

  // Override res.json to log response
  const originalJson = res.json;
  res.json = function(body) {
    const responseTime = Date.now() - req.startTime;
    console.log(`[${timestamp}] ${method} ${url} - ${res.statusCode} - ${responseTime}ms`);
    
    // Log errors
    if (res.statusCode >= 400) {
      console.error(`  Error: ${body.error?.message || 'Unknown error'}`);
    }

    return originalJson.call(this, body);
  };

  // Track request start time
  req.startTime = Date.now();

  next();
};

module.exports = { logger };
