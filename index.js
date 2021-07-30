const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const SettingsBill = require("./settings-bill");
const settingsBillFactory = SettingsBill();
const app = express();
var moment = require("moment");
moment().format();

const handlebarSetup = exphbs({
	partialsDir: "./views/partials",
	viewPath: "./views",
	layoutsDir: "./views/layouts",
});
app.use(express.static("public"));
app.engine("handlebars", handlebarSetup);
app.set("view engine", "handlebars");
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.get("/", (req, res) => {
	res.render("index", {
		settings: settingsBillFactory.getSettings(),
		totals: settingsBillFactory.totals(),
		theLevels: settingsBillFactory.theLevels(),
	});
});

app.post("/settings", (req, res) => {
	settingsBillFactory.setSettings({
		callCost: req.body.callCost,
		smsCost: req.body.smsCost,
		warningLevel: req.body.warningLevel,
		criticalLevel: req.body.criticalLevel,
	});
	res.redirect("/");
});
app.post("/action", (req, res) => {
	settingsBillFactory.recordAction(req.body.actionType);
	res.redirect("/");
});
app.get("/actions", (req, res) => {
	const actions = settingsBillFactory.actions();
	for (let prop of actions) {
		prop.ago = moment(prop.timestamp).fromNow();
	}
	res.render("actions", { actions: settingsBillFactory.actions() });
});
app.get("/actions/:actionType", (req, res) => {
	const actionType = req.params.actionType;
	const actions = settingsBillFactory.actionsFor(actionType);
	for (let prop of actions) {
		prop.ago = moment(prop.timestamp).fromNow();
	}
	res.render("actions", {
		actions: settingsBillFactory.actionsFor(actionType),
	});
});

const PORT = process.env.PORT || 9090;

app.listen(PORT, () => {
	console.log("app started on port:", PORT);
});
