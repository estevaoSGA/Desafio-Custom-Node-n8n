import {
	IExecuteFunctions,
} from 'n8n-core';

import {
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import {
	OptionsWithUri,
} from 'request';

export class FriendGrid implements INodeType {
	description: INodeTypeDescription = {
		properties: [

		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
	}
}
displayName: 'FriendGrid',
name: 'friendGrid',
icon: 'file:friendGrid.svg',
group: ['transform'],
version: 1,
description: 'Consume SendGrid API',
defaults: {
	name: 'FriendGrid',
},
inputs: ['main'],
outputs: ['main'],
credentials: [
	{
		name: 'friendGridApi',
		required: true,
	},
],
{
	displayName: 'Resource',
	name: 'resource',
	type: 'options',
	options: [
		{
			name: 'Contact',
			value: 'contact',
		},
	],
	default: 'contact',
	noDataExpression: true,
	required: true,
	description: 'Create a new contact',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	displayOptions: {
		show: {
			resource: [
				'contact',
			],
		},
	},
	options: [
		{
			name: 'Create',
			value: 'create',
			description: 'Create a contact',
			action: 'Create a contact',
		},
	],
	default: 'create',
	noDataExpression: true,
},
{
	displayName: 'Email',
	name: 'email',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			operation: [
				'create',
			],
			resource: [
				'contact',
			],
		},
	},
	default:'',
	placeholder: 'name@email.com',
	description:'Primary email for the contact',
},
{
	displayName: 'Additional Fields',
	name: 'additionalFields',
	type: 'collection',
	placeholder: 'Add Field',
	default: {},
	displayOptions: {
		show: {
			resource: [
				'contact',
			],
			operation: [
				'create',
			],
		},
	},
	options: [
		{
			displayName: 'First Name',
			name: 'firstName',
			type: 'string',
			default: '',
		},
		{
			displayName: 'Last Name',
			name: 'lastName',
			type: 'string',
			default: '',
		},
	],
},

const items = this.getInputData();
let responseData;
const returnData = [];
const resource = this.getNodeParameter('resource', 0) as string;
const operation = this.getNodeParameter('operation', 0) as string;

for (let i = 0; i < items.length; i++) {
	if (resource === 'contact') {
		if (operation === 'create') {

			const email = this.getNodeParameter('email', i) as string;

			const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
			const data: IDataObject = {
				email,
			};

			Object.assign(data, additionalFields);

			const options: OptionsWithUri = {
				headers: {
					'Accept': 'application/json',
				},
				method: 'PUT',
				body: {
					contacts: [
						data,
					],
				},
				uri: `https://api.sendgrid.com/v3/marketing/contacts`,
				json: true,
			};
			responseData = await this.helpers.requestWithAuthentication.call(this, 'friendGridApi', options);
			returnData.push(responseData);
		}
	}
}

return [this.helpers.returnJsonArray(returnData)];
