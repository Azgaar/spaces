import React, {FC, useContext, useState} from "react";
import {Snackbar} from "@material-ui/core";
import {Alert} from "@material-ui/lab";
import {MESSAGE_HIDE_DURATION} from "../../config";

export const MessageContext = React.createContext<MessageContextI>({} as MessageContextI);

const MessageProvider: FC = ({children}) => {
  const [{open, message}, setState] = useState<MessageState>({open: false, message: null});

  const pushMessage = (message: Message): void => setState(() => ({open: true, message}));
  const handleClose = (): void => setState(() => ({open: false, message: null}));

  return (
    <MessageContext.Provider value={{pushMessage}}>
      {children}
      {message && (
        <Snackbar open={open} onClose={handleClose} autoHideDuration={MESSAGE_HIDE_DURATION}>
          <Alert onClose={handleClose} severity={message.type} variant="filled">
            {message.title}
          </Alert>
        </Snackbar>
      )}
    </MessageContext.Provider>
  );
};

const useMessage = (): MessageContextI => useContext(MessageContext);

interface MessageContextI {
  pushMessage: (message: Message) => void;
}

type Message = {
  type: MessageType;
  title: string;
};

type MessageState = {
  open: boolean;
  message: Message | null;
};

enum MessageType {
  ERROR = "error",
  SUCCESS = "success",
  WARNING = "warning",
  INFO = "info"
}

export {MessageProvider, useMessage, MessageType};
