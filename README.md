# react-channel-store

React component decorator for `channel-store` middleware plugin to expose the ambient state to components

### Installation

`yarn add react-channel-store`

`npm install react-channel-store`


### Use

First, follow the installation instructions for [channel-store](https://github.com/zpxp/channel-store) and [react-channel-event](https://github.com/zpxp/react-channel-event)

In your App startup create a `IHub` instance and add the store middleware `createStoreMiddleware`.

``` tsx

import { createHub } from "channel-event";
import { createStoreMiddleware, IStoreEvents } from "channel-store";

export interface AppState {
   count: number
}


const hub = createHub(...);

const store = createStoreMiddleware<AppState>(hub)
                  .addDefaultState({ count: 4 })
                  .build();

```

Then wrap the root of your App with `ChannelEventProvider` to allow react components to access the hub you created in the last step

``` tsx
      <ChannelEventProvider hub={hub}>
            <App />
      </ChannelEventProvider>
```

Now, components can be decorated with `Connect` to inject state values into the props.

``` tsx
import { Connect, IStoreConnect } from "react-channel-store";
import { IStoreEvents } from "channel-store";
import { ChannelEvent, ChannelProps } from "react-channel-event";

// map the state into component's props
@Connect<Props>(state => ({
   countMember: state.count
}))
export default class Test extends React.PureComponent<Props, State> {
   render() {
      // the state's count member now is accessable as this.props.countMember
      return (
         <div>
            <button
               onClick={() =>
                  this.props.setStore(state => ({ count: state.count + 1 }))
               }
            >
               send count
            </button>
            {this.props.countMember}
         </div>
      );
   }
}

// or without a decorator

// export default Connect(state => ({
//   countMember: state.count
// }))(Test);

interface Props extends IStoreConnect<AppState> {
   countMember: number;
}

interface State {}


```


Add the `@ChannelEvent()` decorator, as well as the `ChannelProps<...>` interface to the props (typescript only), to access the channel in `this.props.channel`