"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Constant = void 0;
class Constant {
}
exports.Constant = Constant;
Constant.resetRandomCodeString = Math.random().toString(36).substring(36);
Constant.JWTSecret = "jedJlxSecret2023";
Constant.randomCodeString = function (length = 6) {
    return Math.random().toString(20).substr(2, length);
};
Constant.randomString = Constant.randomCodeString(7);
Constant.ResetCodeString = function (length = 6) {
    return Math.random().toString(20).substr(2, length);
};
Constant.randomCode = Math.floor(Math.random() * 100000 + 1);
Constant.resetRandomCode = Math.floor(Math.random() * 100000 + 1);
Constant.resetString = Constant.ResetCodeString(7);
//# sourceMappingURL=constant.js.map