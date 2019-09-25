import { dashboardConstants } from '../_constants';

export function dashboard(state = {}, action) {
  switch (action.type) {
    case dashboardConstants.DASHBOARD_GETSTATS_SUCCESS:
      return {
        ...state,
        stats: action.data
      };
    case dashboardConstants.DASHBOARD_GETSCORES_SUCCESS:
      return {
        ...state,
        scores: action.data
      };
    case dashboardConstants.DASHBOARD_GETNOTIFICATIONS_SUCCESS:
      return {
        ...state,
        notifications: action.data
      };
    default:
      return state
  }
}
