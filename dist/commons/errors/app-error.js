"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomMatches1 = exports.CustomMatches = exports.AppError = void 0;
const class_validator_1 = require("class-validator");
class AppError {
    constructor(code, message) {
        this.code = code;
        this.message = message;
    }
}
exports.AppError = AppError;
class CustomMatches {
    constructor(pattern, validationOptions) {
        this.pattern = pattern;
        this.validationOptions = validationOptions;
    }
}
exports.CustomMatches = CustomMatches;
new CustomMatches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password is too weak',
    mes: '',
});
const CustomMatches1 = (pattern, validationOptions) => {
    validationOptions = {};
    validationOptions.message = 'Message';
    return (0, class_validator_1.Matches)(pattern, validationOptions);
};
exports.CustomMatches1 = CustomMatches1;
//# sourceMappingURL=app-error.js.map