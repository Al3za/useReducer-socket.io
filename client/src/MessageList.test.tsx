import React from "react";
import { render, screen } from "@testing-library/react";
import MessageList from "./components/MessageList";

describe("testing message", () => {
  test("testing empty mess", () => {
    render(<MessageList messages={[]} />);

    expect(screen.queryAllByRole("listItems").length).toBe(0);
  });

  test("testing not empty message", () => {
    render(<MessageList messages={[{ id: "123", text: "hej" }]} />);
    expect(screen.getByText("hej")).toBeVisible();
    // screen är den autput vi får från render(), och getByText('hej') tittar om det finns en likadan string i vor render message;
  }); //getByLabelText check it later
});
