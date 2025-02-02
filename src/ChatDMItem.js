import { Component } from "inferno";
import Avatar from "./Avatar";
import IconListItem from "./ui/IconListItem";

class ChatDMItem extends Component {
  updatePresence = (event, user) => {
    if (user.userId === this.props.userId)
      this.setState({
        online: user.presence,
        displayName: user.displayName,
      });
  };

  updateLastEvent = (event, room, ts) => {
    //if (!ts) console.log(this.props.userId, event, room);
  };

  constructor(props) {
    super(props);
    const { userId, lastEvent } = props;
    this.lastEventTime = -1;
    this.state = {
      lastEvent: lastEvent,
      online: null,
      displayName: "",
    };
    window.mClient.getPresence(userId).then((result) => {
      this.setState({ online: result.presence });
    });
  }

  componentWillMount() {
    window.mClient.addListener("User.presence", this.updatePresence);
    window.mClient.addListener("Room.timeline", this.updateLastEvent);
  }

  componentWillUnmount() {
    window.mClient.removeListener("User.presence", this.updatePresence);
    window.mClient.removeListener("Room.timeline", this.updateLastEvent);
  }

  render() {
    const { avatar, userId, isFocused, displayName } = this.props;
    return (
      <IconListItem
        icon=<Avatar avatar={avatar} online={this.state.online} />
        secondary={this.state.displayName || displayName || userId}
        primary={this.state.lastEvent}
        isFocused={isFocused}
      />
    );
  }
}

export default ChatDMItem;
