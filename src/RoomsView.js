import { Component } from "inferno";

import ListView from "./ListView";
import hashIcon from "./hash_icon.png";
import ChatRoomItem from "./ChatRoomItem";
import TextListItem from "./ui/TextListItem";
import { makeHumanReadableEvent } from "./utils";

class RoomsView extends Component {
  handleKeyDown = (evt) => {};

  cursorChangeCb = (cursor) => {
    if (this.rooms.length !== 0)
      this.props.selectedRoomCb(this.rooms[cursor].roomId);
    else this.props.selectedRoomCb(null);
    this.setState({ cursor: cursor });
  };

  getRooms = (room) =>
    room.getJoinedMemberCount() > 2 && room.getMyMembership() === "join";

  constructor(props) {
    super(props);
    this.rooms = [];
    this.state = window.stateStores.get("RoomsView") || {
      cursor: 0,
    };
  }

  componentWillMount() {
    document.addEventListener("keydown", this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown);
    window.stateStores.set("RoomsView", this.state);
  }

  render() {
    const client = window.mClient;
    this.rooms = client
      .getVisibleRooms()
      .filter(this.getRooms)
      .map((room) => {
        let roomEvents = room.getLiveTimeline().getEvents();
        let lastEvent = roomEvents[roomEvents.length - 1];
        const lastEventTime = lastEvent.getTs();
        const lastEventContent = lastEvent.getContent();
        const lastEventType = lastEvent.getType();
        const lastEventSender = lastEvent.getSender();
        const roomId = room.roomId;
        let avatarUrl;
        avatarUrl =
          room.getAvatarUrl(client.baseUrl, 36, 36, "scale") || hashIcon;
        return {
          roomId: roomId,
          avatarUrl: avatarUrl,
          lastEvent: makeHumanReadableEvent(
            lastEventType,
            lastEventContent,
            lastEventSender,
            client.getUserId(),
            true
          ),
          lastEventTime: lastEventTime,
        };
      })
      .sort((first, second) => {
        return first.userId > second.userId;
      });
    let renderedRooms = this.rooms.map((room, index) => {
      let item = (
        <ChatRoomItem
          roomId={room.roomId}
          avatar={room.avatarUrl}
          lastEvent={room.lastEvent}
        />
      );
      item.props.isFocused = index === this.state.cursor;
      return item;
    });

    if (renderedRooms.length === 0) {
      renderedRooms.push(<TextListItem primary="No Rooms :(" isFocused />);
    }
    return (
      <ListView cursor={this.state.cursor} cursorChangeCb={this.cursorChangeCb}>
        {renderedRooms}
      </ListView>
    );
  }
}

export default RoomsView;
