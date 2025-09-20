const BASE_URL = 'https://fakestoreapi.com';

export interface ApiRequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

export const apiRequest = async <T>(
  endpoint: string,
  options: ApiRequestOptions = {},
): Promise<T> => {
  try {
    const url = `${BASE_URL}${endpoint}`;

    const defaultHeaders = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    const headers = {
      ...defaultHeaders,
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      console.log('❌ API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        url: url,
        headers: Object.fromEntries(response.headers.entries())
      });

      // Try to get error message from response body
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        console.log('❌ API Error Data:', errorData);
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (parseError) {
        console.log('❌ Could not parse error response:', parseError);
      }

      throw new Error(errorMessage);
    }

    // Parse and return the JSON response
    const data = await response.json();
    return data as T;
  } catch (error) {
    // Log the error for debugging
    console.error('API Request Error:', error);

    // Re-throw the error so it can be handled by the calling code
    throw error;
  }
};

export const apiGet = <T>(endpoint: string): Promise<T> => {
  return apiRequest<T>(endpoint, { method: 'GET' });
};

export const apiPost = <T>(endpoint: string, data: any): Promise<T> => {
  return apiRequest<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const apiPut = <T>(endpoint: string, data: any): Promise<T> => {
  return apiRequest<T>(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const apiPatch = <T>(endpoint: string, data: any): Promise<T> => {
  return apiRequest<T>(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};

export const apiDelete = <T>(endpoint: string): Promise<T> => {
  return apiRequest<T>(endpoint, { method: 'DELETE' });
};
