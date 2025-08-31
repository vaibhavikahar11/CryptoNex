export function shouldShowNavbar(currentPath, routes, userRole) {
  if (!userRole) userRole = "ROLE_USER";

  // Replace dynamic segments with a regex that matches any value
  const pathToRegex = (path) =>
    new RegExp(
      "^" +
        path
          .replace(/:\w+/g, "([^/]+)") // Match any value between slashes
          .replace(/\//g, "\\/") + // Escape slashes
        "$"
    );

  // Return true if there's a route matching the path and user's role
  return routes.some(
    (route) =>
      (route.role === userRole || userRole === "ROLE_ADMIN") &&
      pathToRegex(route.path).test(currentPath)
  );
}
