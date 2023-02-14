"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const user_1 = require("../entities/user");
const express_1 = __importDefault(require("express"));
const typeorm_1 = require("typeorm");
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
const process = __importStar(require("process"));
const fs = __importStar(require("fs"));
const client_s3_1 = require("@aws-sdk/client-s3");
const child_process_1 = require("child_process");
const media_entity_1 = require("../entities/media.entity");
const path_1 = __importDefault(require("path"));
const errors_codes_1 = require("../commons/errors/errors-codes");
(0, express_1.default)();
const bcrypt = __importStar(require("bcrypt"));
const jwt = __importStar(require("jsonwebtoken"));
const passport_1 = __importDefault(require("passport"));
const qrcode = __importStar(require("qrcode"));
class UserService {
    constructor() {
        this.userRepo = (0, typeorm_1.getRepository)(user_1.User);
        this.mediaRepo = (0, typeorm_1.getRepository)(media_entity_1.Media);
    }
    async getAll(req, res) {
        const allUsers = await this.userRepo.find();
        res.json(allUsers);
    }
    async findOne(req, res) {
        try {
            const id = req.params.id;
            const user = await this.userRepo.findOneBy({ id });
            if (user == null) {
                return res.status(404).json({ NotFoundException: errors_codes_1.ERR_NOT_FOUND_USER });
            }
            res.json(user);
        }
        catch (e) {
            return res.status(401).json({ NotFoundException: errors_codes_1.ERR_NOT_FOUND_USER });
        }
    }
    async register(req, res) {
        const { first_name, last_name, email, password } = req.body;
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await this.userRepo.create({
            first_name,
            last_name,
            email,
            password: hashedPassword,
        });
        const newUser = await this.userRepo.save(user);
        res.json(newUser);
    }
    async login(req, res) {
        const { email, password } = req.body;
        const user = await this.userRepo.findOne({ where: { email } });
        if (!user) {
            return res
                .status(401)
                .json({ UnauthorizedException: errors_codes_1.EMAIL_OR_PASSWORD_IS_INCORRECT });
        }
        else {
            if (user.activated === false) {
                throw new common_1.ConflictException("you should activate your account");
            }
            else {
                if (user && (await bcrypt.compare(password, user.password))) {
                    const payload = { email };
                    const accessExpireIn = "1d";
                    const access = this._generateToken(payload, accessExpireIn);
                    const access_expire_at = new Date(new Date().getTime() + accessExpireIn);
                    const refreshExpireIn = "2d";
                    const refresh = this._generateToken(payload, refreshExpireIn);
                    const refresh_expire_at = new Date(new Date().getTime() + refreshExpireIn);
                    user.access = await access;
                    user.access_expire_at = access_expire_at;
                    user.refresh = await refresh;
                    user.refresh_expire_at = refresh_expire_at;
                    res.json(user);
                }
                else {
                    return res
                        .status(401)
                        .json({ UnauthorizedException: errors_codes_1.EMAIL_OR_PASSWORD_IS_INCORRECT });
                }
            }
        }
    }
    async _generateToken(payload, expiresIn) {
        const token = jwt.sign(payload, process.env.SECRET_KEY, {
            expiresIn: expiresIn,
        });
        return token;
    }
    loginWithFacebook() {
    }
    async callback(req, res) {
        try {
            passport_1.default.authenticate("facebook", { failureRedirect: "/login" });
            res.redirect("https://www.facebook.com");
        }
        catch (e) {
            res.status(501).json("INTERNAL_SERVER_ERR");
        }
    }
    loginWithGoogle() {
    }
    callbacks(req, res) {
        try {
            passport_1.default.authenticate("facebook", { failureRedirect: "/login" });
            res.redirect("https://mail.google.com");
        }
        catch (e) {
            res.status(501).json("INTERNAL_SERVER_ERR");
        }
    }
    loginWithTwitter() {
    }
    twitterCallback(req, res) {
        try {
            passport_1.default.authenticate("facebook", { failureRedirect: "/login" });
            res.redirect("https://twitter.com/home");
        }
        catch (e) {
            res.status(501).json("INTERNAL_SERVER_ERR");
        }
    }
    async generateQRCode(res) {
        try {
            const qrCode = qrcode.toDataURL("im a pony");
            console.log(qrCode);
            res.status(200).send(qrCode);
        }
        catch (error) {
            res.status(500).send(error);
        }
    }
    async upload(req, res) {
        console.log(req.file);
        let mediaPath = process.env.MEDIA_PATH;
        const get_extension = this._getFileExtension(req.file.path);
        if (get_extension == ".mp4" ||
            get_extension == ".mov" ||
            get_extension == ".wmv" ||
            get_extension == ".avi" ||
            get_extension == ".f4v" ||
            get_extension == ".webm") {
            try {
                const bucket = process.env.AWS_BACKET_NAME;
                const uploadParams = this._getAwsUploadParams();
                const s3 = new client_s3_1.S3({
                    region: uploadParams.region,
                });
                const command = new client_s3_1.AbortMultipartUploadCommand({
                    Key: "",
                    Bucket: bucket,
                    UploadId: "",
                });
                req.file.path = mediaPath;
                const transcode_video = await this._transcodeVideo(req.file, req.file.path);
                const media = await this.mediaRepo.findOneBy({
                    pid: transcode_video.pid,
                });
                const output = `${mediaPath}/${media.outputVideo}`;
                const transcodeFile = fs.readFileSync(output);
                const params = {
                    Body: transcodeFile,
                    Bucket: bucket,
                    Key: `${(0, uuid_1.v4)()}-${req.file.originalname}`,
                    ContentType: req.file.mimetype,
                    ACL: "public-read",
                };
                const uploaded_file = await s3.send(command);
                res.json(`File uploaded successfully. ${uploaded_file.$metadata.cfId}`);
            }
            catch (e) {
                console.log(e);
                res.json("err upload");
            }
        }
        else {
            return res.status(401).json({
                code: errors_codes_1.THIS_TYPE_OF_FILE_IS_NOT_A_VIDEO_TYPE,
            });
        }
    }
    _getFileExtension(filePath) {
        return path_1.default.extname(filePath);
    }
    async uploadFile(req, res) {
        const n = 5;
        for (let i = 1; i <= n; i++) {
            for (let j = 1; j <= n - i; j++) {
                process.stdout.write(" ");
            }
            for (let k = 0; k < 2 * i - 1; k++) {
                process.stdout.write("*");
            }
            console.log();
        }
        console.log(req.file);
        try {
            const bucket = process.env.AWS_BACKET_NAME;
            const secretAccessKey = process.env.AWS_SECRET_KEY;
            const command = new client_s3_1.AbortMultipartUploadCommand({
                Key: secretAccessKey,
                Bucket: bucket,
                UploadId: "",
            });
            const uploadParams = this._getAwsUploadParams();
            const s3 = new client_s3_1.S3({
                region: uploadParams.region,
            });
            const fileContent = fs.readFileSync(`${req.file.path}`);
            const uploaded_file = await s3.send(command);
            res.json(`File uploaded successfully. ${uploaded_file.$metadata.cfId}`);
        }
        catch (e) {
            console.log(e);
            res.json("err upload");
        }
    }
    _getAwsUploadParams() {
        const region = process.env.AWS_BACKET_REGION;
        const accessKeyId = process.env.AWS_ACCESS_KEY;
        const secretAccessKey = process.env.AWS_SECRET_KEY;
        return { region, accessKeyId, secretAccessKey };
    }
    async _transcodeVideo(file, inputVideoPath) {
        const outputVideo = `${(0, uuid_1.v4)()}-output.mp4`;
        const transcodeCommand = `ffmpeg -i ${inputVideoPath}/${file.originalname} -c:v libx264 -preset ultrafast -c:a aac -strict experimental ${inputVideoPath}/${outputVideo}`;
        const transferCommand = `mv ${outputVideo} /Users/jed/Downloads`;
        const transCode = await new Promise(async (resolve, reject) => {
            return (0, child_process_1.exec)(transcodeCommand, (error, stdout, stderr) => {
                if (error) {
                    reject(error);
                }
                else {
                    console.log(stderr);
                    resolve(stdout);
                }
            });
        }).then(async (value) => (0, child_process_1.exec)(transferCommand));
        const pid = transCode.pid;
        const media = this.mediaRepo.create({
            outputVideo,
            pid,
        });
        await this.mediaRepo.save(media);
        return transCode;
    }
    async remove(req, res) {
        const id = req.params.id;
        const result = await this.userRepo.delete({ id: id });
        console.log(result);
        if (result.affected === 0) {
            return res.status(404).json({
                code: errors_codes_1.ERR_NOT_FOUND_USER,
            });
        }
        res.json({ code: errors_codes_1.USER_DELETED_SUCCESSFULLY });
    }
}
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map