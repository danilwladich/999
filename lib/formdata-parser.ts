export function parseJsonFromFormData(formData: FormData): Object {
	const json: any = {};

	formData.forEach((data, name) => {
		if (name.includes("[]")) {
			json[name.split("[]")[0]] = formData.getAll(name);
			return;
		}

		json[name] = data;
	});

	return json;
}

export function parseFormDataFromJson(json: { [k: string]: any }): FormData {
	const formData = new FormData();

	for (const key in json) {
		if (typeof json[key] === "object") {
			for (const item of json[key]) {
				formData.append(key + "[]", item);
			}
			continue;
		}

		formData.append(key, json[key]);
	}

	return formData;
}
