import { SentensiPackage } from '@/lib/logic/sentensi-package';
import { CreateGeneral } from '@/lib/logic/packages/generals/create.general';
import { Subset } from '@/lib/logic/packages/tools/models';

export abstract class Tool<T> extends SentensiPackage<CreateGeneral>{
	initialState: T;

	protected constructor(tool: T, general: CreateGeneral) {
		super(general);

		this.initialState = tool;
		this._state = tool;
	}

	private _state: T;

	get state(): T {
		return this._state;
	}

	set state(value: Subset<T>) {
		this._state = { ...this._state, ...value };
	}

	reset(): void {
		this._state = { ...this.initialState };
	}
}
