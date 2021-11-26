import {setMe} from "../redux/actions";
import {showDrawerCategory} from "../components/layouts/DrawerConfiguration";
import {subjectsCategory} from "../constants/subjects";

export const getMe = () => async (dispatch:any) => {
	const request
		= await fetch(`${process.env.NEXT_PUBLIC_PANAMA_HOST}/me`,
		{
			method: "GET",
			credentials: 'include',
			headers: {
				'accept':  'application/json'
			}
		});
	const response = await request.json();
	const data = response.data;
	if(data.subjects) {
		data.subjectsMap = data.subjects.map((item: { name: string; }) => item.name);
	}
	const READ = 0;
	const CREATE = 1;
	const UPDATE = 2;
	const DELETE = 3;
	if(data.subjects) {
		data.read = {};
		data.update = {};
		data.delete = {};
		data.create = {};
		data.showDrawerCategory = {...showDrawerCategory};
		for(let i in data.subjects) {
			data.read[data.subjects[i].name] = data.subjects[i].abilities[READ].can;
			data.update[data.subjects[i].name] = data.subjects[i].abilities[UPDATE].can;
			data.delete[data.subjects[i].name] = data.subjects[i].abilities[DELETE].can;
			data.create[data.subjects[i].name] = data.subjects[i].abilities[CREATE].can;

			if(data.read[data.subjects[i].name])
				{
					data.showDrawerCategory[subjectsCategory[data.subjects[i].name]]
						= data.read[data.subjects[i].name] || data.showDrawerCategory[subjectsCategory[data.subjects[i].name]];
				}

		}
	}
	console.log('Response public? data: ',data);
	dispatch(setMe(data));
	//dispatch(setEditor({object: response.data.form}));

}
