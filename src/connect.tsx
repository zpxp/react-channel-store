import * as React from "react";
import { ChannelEvent, ChannelProps } from "react-channel-event";
import { ReactComponent } from "z-types";
import { storeEvents, IStoreEvents } from "channel-store";

const defaultconf: Config = {
	forwardRef: true
};

interface Config {
	/** Forward ref to `props.ref`. Default true */
	forwardRef?: boolean;
}

function ConnectImpl<Selecter extends (state: any) => Partial<any>>(
	component: typeof React.Component,
	mapStateToProps: Selecter,
	conf: Config
) {
	conf = { ...defaultconf, ...conf };

	@ChannelEvent()
	class StoreConnect extends React.PureComponent<{ _internal_ref: any } & ChannelProps<IStoreEvents<object>>, { currentState: object }> {
		static __STORE_CONNECT = true;
		setStore: (data: object | ((oldStore: object) => object), callback?: () => void) => void;
		cbs: Array<() => void>;

		constructor(props: { _internal_ref: any } & ChannelProps<IStoreEvents<object>>) {
			super(props);
			this.cbs = [];

			this.state = {
				currentState: mapStateToProps(this.props.channel.send(storeEvents.GET_STATE))
			};

			this.props.channel.listen(storeEvents.STATE_UPDATED, (data: any) => {
				this.setState(
					prev => {
						return { currentState: mapStateToProps(data.payload) };
					},
					() => {
						if (this.cbs.length) {
							this.cbs.forEach(x => x());
							this.cbs = [];
						}
					}
				);
			});

			const inst = this;

			this.setStore = function(data: Partial<object> | ((oldStore: object) => Partial<object>), callback?: () => void) {
				callback && inst.cbs.push(callback);
				inst.props.channel.send(storeEvents.UPDATE_STATE, data);
			};
		}

		render() {
			const Elem = component;
			const { _internal_ref, ...props } = this.props;
			return <Elem {...props} {...this.state.currentState} setStore={this.setStore} ref={_internal_ref} />;
		}
	}

	const El = StoreConnect as any;

	return conf.forwardRef ? React.forwardRef((props, ref) => <El {...props} _internal_ref={ref} />) : StoreConnect;
}

/**
 * Expose current `channel-store` state to decorated component and injects desired values into `component.props`
 * @param mapStateToProps Function that takes the current state and returns an object representing values that will be injected into `props`
 * @param config
 */
export function Connect<
	Props extends object,
	State extends object = any,
	Selecter extends (state: State) => Partial<Props> = (state: State) => Partial<Props>
>(mapStateToProps: Selecter, config?: Config) {
	return function<P extends ReturnType<Selecter>, T = ReactComponent<P>>(component: T): T {
		return (ConnectImpl(component as any, mapStateToProps, config) as any) as T;
	};
}

/**
 * Interface to define props passed down from `Connect`
 */
export interface IStoreConnect<State extends object> {
	/**
	 * Automaticly send the update event in the current channel context to update the ambient store
	 * @param data
	 * @param callback
	 */
	setStore(data: Partial<State> | ((oldState: State) => Partial<State>), callback?: () => void): void;
}
