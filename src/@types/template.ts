declare module "z-types" {
	export type ReactComponent<P = any, S = any> = new (props: P, context?: any) => React.Component<P, S>;

	/**
	 * Extract keys from type `T` that match type`P`
	 *
	 * `eventname: keyof FunctionProperties<MeType, string>` gets all `string` props from `MeType`
	 */
	export type PropertiesOfType<T, P> = Pick<T, { [K in keyof T]: T[K] extends P ? K : never }[keyof T]>;

	export type valueof<T> = T[keyof T];

	/**
	 * Array of prop types
	 */
	export type PickSingle<T> = { [P in keyof T]: T[P] };

	/**
	 * remove readonly from type
	 */
	export type Writeable<T> = { -readonly [P in keyof T]-?: T[P] };

	export type GetReturnTypesOfMemberFuncs<T> = { [P in keyof T]: T[P] extends (...args: any[]) => any ? ReturnType<T[P]> : never };

	/**
	 * convert `type1 | type2` to `type1 & type2`
	 */
	export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;

	/**
	 * Return type of named member
	 */
	export type TypeOfMember<T, PROP extends keyof T> = T[PROP];

	/**does what you think it does */
	export type RecursivePartial<T> = {
		[P in keyof T]?: T[P] extends (infer U)[] ? RecursivePartial<U>[] : T[P] extends object ? RecursivePartial<T[P]> : T[P]
	};

	/**  Select all props in T that are not in K 	*/
	export type Omit<T, K> = Pick<T, Exclude<keyof T, keyof K>>;

	/**  Select all props in T that are not named 	*/
	export type OmitName<T, K> = Pick<T, Exclude<keyof T, K>>;

	/** Types of a function's arguments */
	export type ArgumentTypes<F extends Function> = F extends (...args: infer A) => any ? A : never;

	export type Indexable = { [x: string]: any; [x: number]: any };
}
