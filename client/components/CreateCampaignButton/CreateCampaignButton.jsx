import React, { useEffect,useState } from "react";

const CreateCampaignButton = ({ btnType, title, handleClick, styles, isDisabled }) => {
  const [buttonMessage, setButtonMessage] = useState("");

  useEffect(() => {
    setButtonMessage(title);
  }, [])

  const handleMouseOver = () => {
    if(buttonMessage === "Connected"){
      setButtonMessage("Disconnect")
    }
  }

  const handleMouseOut = () => {
    if(buttonMessage === "Disconnect"){
      setButtonMessage("Connected")
    }
  }

  return (
    <button
      type={btnType}
      onClick={(e) => handleClick(e)}
      disabled={isDisabled}
      style={{ backgroundColor: buttonMessage === "Disconnect" ? 'red' : "blue", cursor: "pointer" }}
      className={`font-epilogue font-semibold text-[16px] leading-[26px] text-white min-h-[52px] px-4 rounded-[10px] ${styles}`}
      onMouseOver={() => handleMouseOver()}
      onMouseOut={() => handleMouseOut()}
    >
      {buttonMessage}
    </button>
  )
}

export default CreateCampaignButton