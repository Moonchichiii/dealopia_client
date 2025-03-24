/**
 * Formats error response from authentication endpoints
 */
export const formatAuthError = (error: any): string => {
    let errorMessage = 'An error occurred. Please try again.';
    const errorData = error.response?.data;
    
    if (errorData) {
      if (typeof errorData === 'string') {
        errorMessage = errorData;
      } else if (errorData.detail) {
        errorMessage = errorData.detail;
      } else if (errorData.non_field_errors) {
        // Django REST framework often puts general errors here
        errorMessage = Array.isArray(errorData.non_field_errors)
          ? errorData.non_field_errors.join(', ')
          : errorData.non_field_errors;
      } else {
        // Handle field-specific errors
        const fieldErrors = Object.entries(errorData)
          .map(([field, errors]) => {
            if (Array.isArray(errors)) {
              return `${formatFieldName(field)}: ${errors.join(', ')}`;
            }
            return `${formatFieldName(field)}: ${errors}`;
          })
          .join('; ');
        
        if (fieldErrors) {
          errorMessage = fieldErrors;
        }
      }
    }
    
    return errorMessage;
  };
  
  /**
   * Format field names to be more readable
   */
  const formatFieldName = (field: string): string => {
    // Convert snake_case to Title Case
    return field
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  /**
   * Validate a password against common requirements
   */
  export const validatePassword = (password: string): { valid: boolean; message?: string } => {
    if (password.length < 8) {
      return { valid: false, message: 'Password must be at least 8 characters long' };
    }
    
    if (!/\d/.test(password)) {
      return { valid: false, message: 'Password must contain at least one number' };
    }
    
    if (!/[A-Z]/.test(password)) {
      return { valid: false, message: 'Password must contain at least one uppercase letter' };
    }
    
    if (!/[a-z]/.test(password)) {
      return { valid: false, message: 'Password must contain at least one lowercase letter' };
    }
    
    return { valid: true };
  };
  
  /**
   * Check if passwords match
   */
  export const passwordsMatch = (password: string, confirmPassword: string): boolean => {
    return password === confirmPassword;
  };