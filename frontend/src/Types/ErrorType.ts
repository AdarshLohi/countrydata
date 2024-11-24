type ErrorDetail = {
  field?: string; // For validation errors, the field associated with the error
  message: string; // Error message describing the issue
  code?: string | number; // Optional error code for more precise identification
};

type AppError = {
  name: string; // Name of the error (e.g., "ValidationError", "ServerError")
  message: string; // General error message
  details?: ErrorDetail[]; // Array of detailed error messages (e.g., for field-specific errors)
  statusCode?: number; // HTTP status code (e.g., 404, 500)
  timestamp?: string; // Timestamp when the error occurred
  stack?: string; // Optional stack trace for debugging
};

export default AppError;
