import { Component } from "inferno";
import { findDOMNode } from "inferno-extras";

export default class ScrollIntoView extends Component {
  componentDidUpdate() {
    if(this.item && this.props.isFocused){
      console.log(`[ScrollIntoView] scrolling`);
      findDOMNode(this.item).scrollIntoView();
    }
  }
  render() {
    return (
      <div ref={item => this.item = item}>{this.props.children}</div>
    );
  }
}

// example usage:
//
// let focused = cursor == i;
// return (
//  <ScrollIntoView isFocused={focused}>
//    <SomeItem isFocused={focused}>
//  </ScrollIntoView>
// );
