import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import { useChatGlobalContext } from "../context/ChatContext";

const ScrollableChat = ({ messages }) => {
  const { user } = useChatGlobalContext();

  const isSameSenderMargin = (messages, cur, i, userId) => {
    // console.log(i === messages.length - 1);

    if (
      i < messages.length - 1 &&
      messages[i + 1].sender._id === cur.sender._id &&
      messages[i].sender._id !== userId
    )
      return 33;
    else if (
      (i < messages.length - 1 &&
        messages[i + 1].sender._id !== cur.sender._id &&
        messages[i].sender._id !== userId) ||
      (i === messages.length - 1 && messages[i].sender._id !== userId)
    )
      return 0;
    else return "auto";
  };

  const isSameSender = (messages, cur, i, userId) => {
    return (
      // condition : is the current msg(i) exceeding the array length or if the next msg is not equal to sender and if the msg is undefined. [i+1]=next msg
      i < messages.length - 1 &&
      (messages[i + 1].sender._id !== cur.sender._id ||
        messages[i + 1].sender._id === undefined) &&
      messages[i].sender._id !== userId
    );
  };

  const isLastMessage = (messages, i, userId) => {
    return (
      // condition: if the sent msg is the last msg sent by that user and the id of the last send msg user is not equal to the cur logged in id and that msg exists
      i === messages.length - 1 &&
      messages[messages.length - 1].sender._id !== userId &&
      messages[messages.length - 1].sender._id
    );
  };

  const isSameUser = (messages, cur, i) => {
    return i > 0 && messages[i - 1].sender._id === cur.sender._id;
  };




  return (
    <>
      <ScrollableFeed>
        {messages &&
          messages.map((cur, i) => {
            //console.log(cur.sender.picture);
            return (
              <>
                <div
                  className="d-flex align-items-start mb-2"
                  style={{ flexDirection: "row" }}
                  key={cur._id}
                >
                  {(isSameSender(messages, cur, i, user._id) ||
                    isLastMessage(messages, i, user._id)) && (
                    <img
                      src={cur.sender.picture}
                      alt={cur.sender.name}
                      className="rounded-circle me-2"
                      style={{
                        width: "30px",
                        height: "30px",
                        marginTop: "7px",
                        cursor: "pointer",
                      }}
                    />
                  )}
                  <span
                    className="d-inline-block"
                    style={{
                      backgroundColor:
                        cur.sender._id === user._id ? "#BEE3F8" : "#B9F5D0",
                      marginLeft: isSameSenderMargin(
                        messages,
                        cur,
                        i,
                        user._id
                      ),
                      marginTop: isSameUser(messages, cur, i, user._id)
                        ? "3px"
                        : "10px",
                      borderRadius: "20px",
                      padding: "5px 15px",
                      maxWidth: "75%",
                      wordWrap: "break-word",
                    }}
                  >
                    {cur.content}
                  </span>
                </div>
              </>
            );
          })}
      </ScrollableFeed>
    </>
  );
};

export default ScrollableChat;
