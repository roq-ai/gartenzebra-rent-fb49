const mapping: Record<string, string> = {
  companies: 'company',
  machines: 'machine',
  'rental-requests': 'rental_request',
  'rental-rooms': 'rental_room',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
