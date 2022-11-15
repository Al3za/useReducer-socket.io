import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import MessageSender from "./components/MessageSender";
import { click } from "@testing-library/user-event/dist/click";

describe("testing mess sender", () => {
  test("text in prop is shown input", () => {
    render(<MessageSender tex="abcs" onChang={(_) => {}} onSend={() => {}} />);
    expect(screen.getByDisplayValue("abcs")).toBeVisible();
    // hämtar input fält och förmulär
    const input = screen.getByPlaceholderText(
      "Type message here..."
    ) as HTMLInputElement;
    expect(input.value).toBe("abcs");
  });
  test("onchange is called when input change", () => {
    let ChengedText = undefined;
    render(
      <MessageSender
        tex=""
        onChang={(testo) => {
          ChengedText = testo;
        }}
        onSend={() => {}}
      />
    );
    const input = screen.getByPlaceholderText(
      "Type message here..."
    ) as HTMLInputElement;
    expect(input.value).toBe("");
    fireEvent.change(input, { target: { value: "abcs" } });
    // fireEvent triggas f.ex när användare clickar på ett knap eller mätar in text som i detta fall
    expect(ChengedText).toBe("abcs");
    // ChengedText fick nu värde abcs
  });
  test("onSend is callew when clicking the button", () => {
    let clicked = false;
    render(
      <MessageSender
        tex="abcs"
        onChang={(_) => {}}
        onSend={() => {
          clicked = true;
        }}
      />
    );
    fireEvent.click(screen.getByText("Send"));
    expect(clicked).toBeTruthy();
  });
});
