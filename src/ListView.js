import "KaiUI/src/views/ListView/ListView.scss";
import { Component } from "inferno";
import ScrollIntoView from "./ScrollIntoView";

class ListView extends Component {
  handleKeyDown = (evt) => {
    let cursor = this.state.cursor;
    const { children, cursorChangeCb } = this.props;

    // No navigation is needed when there is only one item (or zero items)
    if(children.length < 2) return;

    if (evt.key === "ArrowUp") {
      cursor--;
      if (cursor === -1) cursor = children.length - 1;
      if (children[cursor] && children[cursor].props.unFocusable) cursor--;
      if (cursor === -1) cursor = children.length - 1;
      // TODO: summarize all of these three "if"s
    } else if (evt.key === "ArrowDown") {
      cursor++;
      if (cursor >= children.length) cursor = 0;
      if (children[cursor] && children[cursor].props.unFocusable) cursor++;
      if (cursor >= children.length) cursor = 0;
      // TODO: same as above! ME LAZY Farooq
    }
    else return;

    console.log(`[ListView] Arrow key pressed, cursor is now ${cursor}`);
    this.setState({ cursor });
    cursorChangeCb && cursorChangeCb(cursor);
  };

  constructor(props) {
    super(props);
    const { children, cursor, cursorChangeCb } = props;
    console.log(`[ListView] Constructor was called: cursor=${cursor}`);
    if (cursor - 1 > children.length || cursor < 0) {
      console.error(
        `[ListView] cursor should be from 0 to ${
          children.length - 1
        } but is ${cursor}`
      );
      throw new Error("cursor is negative or bigger than length of list");
    }
    if (cursorChangeCb) cursorChangeCb(cursor);
    this.state = { cursor };
  }

  componentDidUpdate() {
    const { cursor } = this.props;
    if(cursor !== this.state.cursor) this.setState({ cursor });
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown);
  }

  render() {
    const { height } = this.props;
    const { cursor } = this.state;

    let children = this.props.children;
    if(children && !Array.isArray(children)){
      children = [children];
    }

    return (
      <div
        className={"kai-list-view"}
        style={{
          height: height || "calc(100vh - 60px)",
        }}
      >
        {children && children.map((child, i) => (
          <ScrollIntoView isFocused={i === cursor}>
            {child}
          </ScrollIntoView>
        ))}
      </div>
    );
  }
}

export default ListView;
