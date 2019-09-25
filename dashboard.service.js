import { authHeader } from '../_helpers';
import { apiPath } from '../_helpers';

export const dashboardService = {
    getScores,
    getStats,
    getNotifications
};

function getScores() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(apiPath() + 'analytics/score/events/stage', requestOptions).then(handleResponse);
}

function getStats() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(apiPath() + 'analytics/dashboard/stats', requestOptions).then(handleResponse);
}

function getNotifications() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(apiPath() + 'notifications', requestOptions).then(handleResponse);
}

function handleResponse(response) {
    if (!response.ok) {
        return Promise.reject(response.statusText);
    }

    return response.json();
}
