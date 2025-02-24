/**
 * Removes the ID segment from the route if it exists.
 * @param {string} route - The route path (e.g., "/edit-role/123").
 * @returns {string} - The route without the ID segment.
 */
export const removeIdFromRoute = (route) => {
    const segments = route.split('/'); // Split the route into segments
    const lastSegment = segments[segments.length - 1]; // Get the last segment
  
    // Check if the last segment is an ID (numeric or UUID)
    const isId =
      /^\d+$/.test(lastSegment) || // Check if numeric
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
        lastSegment
      ); // Check if UUID
  
    if (isId) {
      return segments.slice(0, -1).join('/'); // Remove the last segment (ID)
    }
  
    return route; // Return the original route if no ID is found
  };