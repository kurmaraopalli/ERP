"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
class AuthService {
    constructor(config) {
        this.config = config;
    }
    async hashPassword(password) {
        return bcrypt_1.default.hash(password, this.config.saltRounds);
    }
    async verifyPassword(password, hash) {
        return bcrypt_1.default.compare(password, hash);
    }
    generateToken(payload) {
        return jsonwebtoken_1.default.sign(payload, this.config.jwtSecret, {
            expiresIn: this.config.jwtExpiresIn,
        });
    }
    verifyToken(token) {
        try {
            return jsonwebtoken_1.default.verify(token, this.config.jwtSecret);
        }
        catch (error) {
            throw new Error('Invalid or expired token');
        }
    }
    hasPermission(roles, permission) {
        // In a real implementation, you would check roles against permissions
        // For now, we'll use a simple check
        const adminRoles = ['admin', 'superadmin'];
        return roles.some(role => adminRoles.includes(role));
    }
    hasAnyRole(userRoles, requiredRoles) {
        return requiredRoles.some(role => userRoles.includes(role));
    }
    hasAllRoles(userRoles, requiredRoles) {
        return requiredRoles.every(role => userRoles.includes(role));
    }
}
exports.AuthService = AuthService;
exports.default = AuthService;
