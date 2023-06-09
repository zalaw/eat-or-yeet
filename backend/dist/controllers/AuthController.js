"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_errors_1 = __importDefault(require("http-errors"));
const User_1 = __importDefault(require("../models/User"));
class AuthController {
    signup(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, name, password } = req.body;
                const doesExist = yield User_1.default.findOne({ email });
                if (doesExist)
                    throw http_errors_1.default.Conflict("Account already registered");
                const user = new User_1.default({ email, name, password });
                yield user.save();
                res.send({ message: "User created!" });
            }
            catch (err) {
                next(err);
            }
        });
    }
    signin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const user = yield User_1.default.findOne({ email });
                if (!user)
                    throw http_errors_1.default.Unauthorized("Invalid Credentials");
                if (!(yield user.isPasswordValid(password)))
                    throw http_errors_1.default.Unauthorized("Invalid Credentials");
                const accessToken = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET);
                res.send({ user: { id: user._id, name: user.name, email: user.email }, accessToken });
            }
            catch (err) {
                next(err);
            }
        });
    }
    getUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const authorizationHeader = req.headers.authorization;
                if (!authorizationHeader || !authorizationHeader.startsWith("Bearer "))
                    throw http_errors_1.default.Unauthorized("Invalid token");
                const accessToken = authorizationHeader.split(" ")[1];
                const decodedToken = jsonwebtoken_1.default.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
                const user = yield User_1.default.findById(decodedToken.userId);
                if (!user)
                    throw http_errors_1.default.NotFound();
                res.send({ user: { id: user._id, name: user.name, email: user.email }, accessToken });
            }
            catch (err) {
                next(err);
            }
        });
    }
}
exports.default = new AuthController();
