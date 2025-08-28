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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
// A list of all the products you provided
var productsToCreate = [
    { name: "BSA", folderId: "1O-o0PWMBWp45DAubgA0I_09NPc6vxY8h" },
    { name: "BAI Links", folderId: "1GpFyEebUzHgfFdQjTydld9WlYWuobejQ" },
    { name: "BCE", folderId: "1voOtapndf3T3LPPOTeZUpuTXy6S8b0sp" },
    { name: "MEI", folderId: "1Ed5I4Wqun3HyoyiO8QcycYeNpeXF3VKQ" },
    { name: "BAI", folderId: "144WrjYgN32VnragawFKlPxkNNFttQeTt" },
    { name: "BCE Links", folderId: "1Nla9mMNgM4wcrhkJjjAoiKWIBiqZbhKS" },
    { name: "MIM", folderId: "1-LUW0_eGtHrYU9doli0H8PtUBX2TpWYT" },
    { name: "BCY", folderId: "11ab3HBfvmbcSg93iMjpGsiGSQjX1BhWv" },
    { name: "BEC", folderId: "1nKcVpkb6UxON2Ye4bo4x5Zojd-tvE9u5" },
    { name: "BEC Links", folderId: "1F1c_pfnGQZ61W5npCqjPfqHHNhmwfRov" },
    { name: "BSA Links", folderId: "1QCKY916alazgxfDftgnRo-SkYqFQKTsm" },
    { name: "BET", folderId: "1C1KJp1h63VYgCz-TmSsfsOpRXk41jW2S" },
    { name: "BCG", folderId: "1CxmfKX_xrcKS5CXrKa4qK_UC5SovgqhF" },
    { name: "BET Links", folderId: "1MG66pavDJSsXXeJzzpwI13MXeTYd3qN4" },
    { name: "BCY Links", folderId: "1aTj0e7d_kb6PzcV_TzZxl7PQIUW8akpm" },
    { name: "MIM Links", folderId: "1mjxcbfiqQBSqMiQnLYUsJT7OKqJ3DMcf" },
    { name: "BEY Links", folderId: "1oY6JuFX4Uv_viJ0Es3ZKDaOyrRE5qasn" },
    { name: "BEY", folderId: "1uGvJRBvWQQy4ZGAjeXBw47X5x24kgGxd" },
    { name: "MEI Links", folderId: "1uJZmbfdiR2x37GWjwZvNp-SxUrhxiYJG" },
    { name: "BCG Links", folderId: "1xGFjXWNr20RYNO6pLTg-XYxCxYwHYD4l" },
];
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var batch, semester, mainNotesType, linksBundleType, _i, productsToCreate_1, p, isLinksBundle, branchName, branch, product;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Start seeding ...");
                    return [4 /*yield*/, prisma.batch.upsert({
                            where: { name: "24 Batch" },
                            update: {},
                            create: { name: "24 Batch" },
                        })];
                case 1:
                    batch = _a.sent();
                    return [4 /*yield*/, prisma.semester.upsert({
                            where: { name: "Fall Sem 25/26" },
                            update: {},
                            create: { name: "Fall Sem 25/26" },
                        })];
                case 2:
                    semester = _a.sent();
                    return [4 /*yield*/, prisma.type.upsert({
                            where: { name: "Main Notes" },
                            update: {},
                            create: { name: "Main Notes" },
                        })];
                case 3:
                    mainNotesType = _a.sent();
                    return [4 /*yield*/, prisma.type.upsert({
                            where: { name: "Links Bundle" },
                            update: {},
                            create: { name: "Links Bundle" },
                        })];
                case 4:
                    linksBundleType = _a.sent();
                    _i = 0, productsToCreate_1 = productsToCreate;
                    _a.label = 5;
                case 5:
                    if (!(_i < productsToCreate_1.length)) return [3 /*break*/, 9];
                    p = productsToCreate_1[_i];
                    isLinksBundle = p.name.includes("Links");
                    branchName = p.name.replace(" Links", "").trim();
                    return [4 /*yield*/, prisma.branch.upsert({
                            where: { name: branchName },
                            update: {},
                            create: { name: branchName },
                        })];
                case 6:
                    branch = _a.sent();
                    return [4 /*yield*/, prisma.product.create({
                            data: {
                                name: p.name,
                                googleDriveFolderId: p.folderId,
                                price: 50000, // Default price: 500.00 - you can change this
                                isActive: true,
                                description: "Notes for ".concat(p.name, "."),
                                // Connect to the categories we created above
                                batchId: batch.id,
                                semesterId: semester.id,
                                branchId: branch.id,
                                typeId: isLinksBundle ? linksBundleType.id : mainNotesType.id,
                            },
                        })];
                case 7:
                    product = _a.sent();
                    console.log("Created product with id: ".concat(product.id));
                    _a.label = 8;
                case 8:
                    _i++;
                    return [3 /*break*/, 5];
                case 9:
                    console.log("Seeding finished.");
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .then(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); })
    .catch(function (e) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.error(e);
                return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                process.exit(1);
                return [2 /*return*/];
        }
    });
}); });
