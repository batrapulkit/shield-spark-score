import { r as __exportAll$1 } from "../_runtime.mjs";
import { n as createServerFn, r as getServerFnById, t as TSS_SERVER_FUNCTION } from "./ssr.mjs";
import { a as objectType, i as enumType, n as arrayType, o as stringType, r as booleanType, t as anyType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/scan.functions-Cqp79Ftk.js
var scan_functions_Cqp79Ftk_exports = /* @__PURE__ */ __exportAll$1({
	a: () => runScan,
	c: () => submitToCrm,
	i: () => runBreachCheck,
	n: () => getAdminSettings,
	o: () => saveAdminSettings,
	r: () => getSubmissionsList,
	s: () => scan_functions_exports,
	t: () => deleteSubmissionRecord
});
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var scan_functions_exports = /* @__PURE__ */ __exportAll({
	deleteSubmissionRecord: () => deleteSubmissionRecord,
	getAdminSettings: () => getAdminSettings,
	getSubmissionsList: () => getSubmissionsList,
	runBreachCheck: () => runBreachCheck,
	runScan: () => runScan,
	saveAdminSettings: () => saveAdminSettings,
	submitToCrm: () => submitToCrm
});
var runScan = createServerFn({ method: "POST" }).validator((data) => objectType({
	domain: stringType().min(3),
	emails: arrayType(stringType()).default([])
}).parse(data)).handler(createSsrRpc("ad940233a7c2d0ace956d672c49a239de172d3560a825a8e562ab161369076d0"));
var runBreachCheck = createServerFn({ method: "POST" }).validator((data) => objectType({ email: stringType().email() }).parse(data)).handler(createSsrRpc("137eb6da1c2bb411071b447657c3ca0b01fb27723c9aceee5344950ea628ef54"));
var submitToCrm = createServerFn({ method: "POST" }).validator((data) => objectType({
	lead: anyType(),
	profile: anyType(),
	answers: anyType(),
	scan: anyType().nullable()
}).parse(data)).handler(createSsrRpc("8323e29f9d7562c5cb171a71ee40ef0b477fd7aa0fad52be5b34941916ddbb8b"));
var getAdminSettings = createServerFn({ method: "GET" }).handler(createSsrRpc("0e5ce2c2379f46651d1689363e13062dc53a8d8a3510279ce290c4ac8ec52e2c"));
var saveAdminSettings = createServerFn({ method: "POST" }).validator((data) => objectType({
	password: stringType(),
	settings: objectType({
		calendlyUrl: stringType().url(),
		zohoEnabled: booleanType(),
		scanMode: enumType(["authentic", "mock"])
	})
}).parse(data)).handler(createSsrRpc("d2d8ec452e6ddeed8030f790214ec130168c0286abc060f78f21b7cf7ee1ef20"));
var getSubmissionsList = createServerFn({ method: "POST" }).validator((data) => objectType({ password: stringType() }).parse(data)).handler(createSsrRpc("307b6fee2df828a49966abc4bd4192e2f2e0882307bde0bb563b35183d4c6050"));
var deleteSubmissionRecord = createServerFn({ method: "POST" }).validator((data) => objectType({
	password: stringType(),
	email: stringType()
}).parse(data)).handler(createSsrRpc("0ee3879f33d0346abaf75b01d1eb8cb265a666fb1e26ea0414c654a7562bd714"));
//#endregion
export { runScan as a, submitToCrm as c, runBreachCheck as i, getAdminSettings as n, saveAdminSettings as o, getSubmissionsList as r, scan_functions_Cqp79Ftk_exports as s, deleteSubmissionRecord as t };
