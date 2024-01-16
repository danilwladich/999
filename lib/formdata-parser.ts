export function parseJsonFromFormData(formData: FormData): Object {
	const json: any = {};

	formData.forEach((data, name) => {
		json[name] = data;
	});

	return json;
}

export function parseFormDataFromJson(json: { [k: string]: any }): FormData {
	const formData = new FormData();

	for (const key in json) {
		formData.append(key, json[key]);
	}

	return formData;
}
