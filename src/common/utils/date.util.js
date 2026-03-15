"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addHours = addHours;
exports.isPast = isPast;
function addHours(date, hours) {
    return new Date(date.getTime() + hours * 60 * 60 * 1000);
}
function isPast(date) {
    return !!date && date.getTime() < Date.now();
}
