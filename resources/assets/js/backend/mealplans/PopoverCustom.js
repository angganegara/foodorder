import React from "react";
import { Popover, PopoverInteractionKind, Position } from "@blueprintjs/core";

const PopoverCustom = ({ children }) => (
  <Popover position={Position.BOTTOM} interactionKind={PopoverInteractionKind.HOVER} popoverClassName="pt-popover-content-sizing">
    {children}
  </Popover>
);

export default PopoverCustom;
