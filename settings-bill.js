module.exports = function SettingsBill() {
	let smsCost;
	let callCost;
	let warningLevel;
	let criticalLevel;

	let actionList = [];

	function setSettings(settings) {
		smsCost = Number(settings.smsCost);
		callCost = Number(settings.callCost);
		warningLevel = settings.warningLevel;
		criticalLevel = settings.criticalLevel;
	}

	function getSettings() {
		return {
			smsCost,
			callCost,
			warningLevel,
			criticalLevel,
		};
	}

	function recordAction(action) {
		let cost = 0;
		if (action === "sms") {
			cost = smsCost;
		} else if (action === "call") {
			cost = callCost;
		}

		actionList.push({
			type: action,
			cost,
			timestamp: new Date(),
		});
	}

	function actions() {
		return actionList;
	}

	function actionsFor(type) {
		const filteredActions = [];

		for (let index = 0; index < actionList.length; index++) {
			const action = actionList[index];
			if (action.type === type) {
				filteredActions.push(action);
			}
		}

		return filteredActions;
	}

	function getTotal(type) {
		let total = 0;
		for (let index = 0; index < actionList.length; index++) {
			const action = actionList[index];
			if (action.type === type) {
				total += action.cost;
			}
		}
		return total;
	}

	function grandTotal() {
		return getTotal("sms") + getTotal("call");
	}

	function totals() {
		let smsTotal = getTotal("sms").toFixed(2);
		let callTotal = getTotal("call").toFixed(2);
		return {
			smsTotal,
			callTotal,
			grandTotal: grandTotal().toFixed(2),
		};
	}

	function hasReachedWarningLevel() {
		const total = grandTotal();
		const reachedWarningLevel = total >= warningLevel && total < criticalLevel;

		return reachedWarningLevel;
	}

	function hasReachedCriticalLevel() {
		const total = grandTotal();
		return total >= criticalLevel;
	}

	function disableBtn() {
		if (hasReachedCriticalLevel()) {
			return "button";
		} else if (hasReachedWarningLevel()) {
			return "submit";
		} else {
			return "submit";
		}
	}
	function theLevels() {
		if (hasReachedCriticalLevel()) {
			return "danger";
		} else if (hasReachedWarningLevel()) {
			return "warning";
		} else {
			return "totalSettings";
		}
	}

	return {

		setSettings,
		getSettings,
		recordAction,
		actions,
		actionsFor,
		totals,
		disableBtn,
		theLevels,
		hasReachedWarningLevel,
		hasReachedCriticalLevel,
	};
};
