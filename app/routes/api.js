const { validateToken } = require("../../utils/jwt");
const { getAccessManagers, grantAccess, changeApikey, updateAccessManager, deactivateAccessManager } = require("../controllers/accessManager");
const { loginUser, registerUser, updateUser, getUsers, getUser, logoutUser, forgetUser, resetPassword , getDashboard} = require("../controllers/User");
const {
  grantAccessSchema,
  changeApikeySchema,
  updateAccessManagerSchema,
  deactivateApikeySchema
} = require("../validators/accessManager.validator");
const { userLoginSchema, userRegisterSchema, userUpdateSchema, userForgotSchema, resetPasswordSchema } = require("../validators/user.validator");
const { uploadExcel } = require("../controllers/excel");
const { fileUploadHandler } = require("../../utils/fileUploadHandler");
const { searchCompanyData } = require("../controllers/searchCompanyData");
const { viewCompanyData } = require("../controllers/viewCompanyData");
const { validateApiKey } = require("../../utils/accessManagerHandler");
const routes = require("express").Router();


// without token validation routes below
routes.post("/auth", [userLoginSchema], loginUser);
routes.post("/register", [userRegisterSchema], registerUser);
routes.post("/forgetUser", [userForgotSchema], forgetUser);
routes.post("/resetPassword", [ resetPasswordSchema ], resetPassword);
routes.post("/upload", fileUploadHandler,validateToken , uploadExcel);
// with token validation routes below
routes.delete("/logout", [validateToken], logoutUser);
routes.get("/users", [validateToken], getUsers);
routes.get("/getDashboard", [validateToken], getDashboard);
routes.get("/searchCompanyData",[validateApiKey],  searchCompanyData);
routes.get("/viewCompanyData",[validateToken],  viewCompanyData);
routes.get("/user/:_id", [validateToken], getUser);
routes.put("/user/update", [validateToken, userUpdateSchema], updateUser);

routes.get("/accessManagers", [validateToken], getAccessManagers);
routes.post("/grantAccess", [validateToken, grantAccessSchema], grantAccess);
routes.put("/changeApiKey", [validateToken, changeApikeySchema], changeApikey);
routes.post("/deactivateAccessManager", [validateToken, deactivateApikeySchema], deactivateAccessManager);
routes.put("/accessManager/update", [validateToken, updateAccessManagerSchema], updateAccessManager);

module.exports = routes;
