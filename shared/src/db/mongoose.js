"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectMongo = exports.connectMongo = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = require("../utils/logger");
let cachedConnection = null;
const connectMongo = async (uri) => {
    if (cachedConnection) {
        return cachedConnection;
    }
    mongoose_1.default.set('strictQuery', false);
    try {
        await mongoose_1.default.connect(uri);
        cachedConnection = mongoose_1.default;
        logger_1.logger.info('MongoDB connected');
    }
    catch (error) {
        logger_1.logger.error({ err: error }, 'MongoDB connection failed');
        throw error;
    }
    return mongoose_1.default;
};
exports.connectMongo = connectMongo;
const disconnectMongo = async () => {
    if (cachedConnection) {
        await mongoose_1.default.disconnect();
        cachedConnection = null;
        logger_1.logger.info('MongoDB disconnected');
    }
};
exports.disconnectMongo = disconnectMongo;
