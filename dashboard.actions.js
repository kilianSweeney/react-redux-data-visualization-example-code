import { dashboardConstants } from '../_constants';
import { dashboardService } from '../_services';
import { alertActions } from './';
import { history } from '../_helpers';

export const dashboardActions = {
  getScores,
  getStats,
  getNotifications
};

function getScores() {
    return dispatch => {
        dispatch(request());

        dashboardService.getScores()
            .then(
                data => dispatch(success(data)),
                error => dispatch(failure(error))
            );
    };

    function request() { return { type: dashboardConstants.DASHBOARD_GETSCORES_REQUEST } }
    function success(data) { return { type: dashboardConstants.DASHBOARD_GETSCORES_SUCCESS, data } }
    function failure(error) { return { type: dashboardConstants.DASHBOARD_GET_FAILURE, error } }
}

function getStats() {
    return dispatch => {
        dispatch(request());

        dashboardService.getStats()
            .then(
                data => dispatch(success(data)),
                error => dispatch(failure(error))
            );
    };

    function request() { return { type: dashboardConstants.DASHBOARD_GETSTATS_REQUEST } }
    function success(data) { return { type: dashboardConstants.DASHBOARD_GETSTATS_SUCCESS, data } }
    function failure(error) { return { type: dashboardConstants.DASHBOARD_GET_FAILURE, error } }
}

function getNotifications() {
    return dispatch => {
        dispatch(request());

        dashboardService.getNotifications()
            .then(
                data => dispatch(success(data)),
                error => dispatch(failure(error))
            );
    };

    function request() { return { type: dashboardConstants.DASHBOARD_GETNOTIFICATIONS_REQUEST } }
    function success(data) { return { type: dashboardConstants.DASHBOARD_GETNOTIFICATIONS_SUCCESS, data } }
    function failure(error) { return { type: dashboardConstants.DASHBOARD_GET_FAILURE, error } }
}
