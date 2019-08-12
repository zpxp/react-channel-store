# react-channel-store

React component decorator for `channel-store` middleware plugin to expose the ambient state to components

### Installation

`yarn add react-channel-store`

`npm install react-channel-store`


### Use


``` tsx
import { Connect, IStoreConnect } from "react-channel-store";
import { IStoreEvents } from "channel-store";
import { ChannelEvent, ChannelProps } from "react-channel-event";

// map the state into component's props
@Connect<Props>(state => ({
   countMember: state.count
}))
@ChannelEvent()
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

interface Props extends ChannelProps<IStoreEvents<AppState>>, IStoreConnect<AppState> {
   countMember: number;
}

interface State {}


interface AppState { 
   count: number
}


```