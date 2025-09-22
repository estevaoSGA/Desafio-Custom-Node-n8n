import { IExecuteFunctions } from 'n8n-core';
import {
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';

export class Random implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Random',
    name: 'random',
    icon: 'file:random.svg',
    group: ['transform'],
    version: 1,
    description: 'True Random Number Generator (Random.org)',
    defaults: { name: 'Random' },
    inputs: ['main'],
    outputs: ['main'],
    properties: [
      {
        displayName: 'Min',
        name: 'min',
        type: 'number',
        default: 1,
        description: 'Minimum integer value (inclusive). Use only integers.',
        typeOptions: { int: true },
      },
      {
        displayName: 'Max',
        name: 'max',
        type: 'number',
        default: 100,
        description: 'Maximum integer value (inclusive). Use only integers.',
        typeOptions: { int: true },
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    const iterations = items.length || 1;

    for (let i = 0; i < iterations; i++) {
      const index = items.length ? i : 0;

      const min = this.getNodeParameter('min', index) as number;
      const max = this.getNodeParameter('max', index) as number;

      if (!Number.isInteger(min) || !Number.isInteger(max)) {
        throw new Error('Parameters "Min" and "Max" must be integers.');
      }
      if (min > max) {
        throw new Error('"Min" cannot be greater than "Max".');
      }

      const url = `https://www.random.org/integers/?num=1&min=${min}&max=${max}&col=1&base=10&format=plain&rnd=new`;

      const options = {
        method: 'GET',
        uri: url,
        json: false,
      };

      const response = await this.helpers.request!(options);
      const text = response.toString().trim();
      const value = parseInt(text, 10);

      if (Number.isNaN(value)) {
        throw new Error(`Invalid response from random.org: "${text}"`);
      }

      returnData.push({ json: { random: value, min, max } });
    }

    return this.prepareOutputData(returnData);
  }
}
