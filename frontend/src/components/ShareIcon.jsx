import React, { useState } from "react";
import {
  EmailShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Button } from "react-bootstrap";

const ShareButton = ({ item }) => {
  const [showButtons, setShowButtons] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    setShowButtons(!showButtons);
  };
  const url = `https://tessy.chiwuzoh.com.ng/item/${item.id}`;

  return (
    <div>
      <Button onClick={handleShare}>
        {!showButtons ? (
          <i className="fas fa-external-link-alt fa-lg" />
        ) : (
          <i className="fas fa-times-circle fa-lg" />
        )}
      </Button>

      {showButtons && (
        <div className="share-icons">
          <CopyToClipboard text={url} onCopy={() => setCopied(!copied)}>
            <Button>
              <i className="fas fa-copy fa-lg" />
            </Button>
          </CopyToClipboard>
          {copied && <small>Copied</small>}

          <Button
            as={EmailShareButton}
            subject={item.name}
            body="Check out this item!"
            url={url}
            style={{ padding: "0.5rem 1rem" }}
          >
            <i className="fas fa-envelope fa-lg" />
          </Button>

          <Button
            as={FacebookShareButton}
            url={url}
            quote="Check out this item!"
            hashtag="#TessyFabricStores"
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#3b5998",
              color: "#fff",
            }}
          >
            <i className="fab fa-facebook fa-lg" />
          </Button>

          <Button
            as={LinkedinShareButton}
            url={url}
            title="Tessy Fabric Stores"
            summary="Why purchase mediocre fabric when you can get quality that makes you look good and lasts for long?"
            source="https:tessy.chiwuzoh.com.ng"
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#007fb1",
              color: "#fff",
            }}
          >
            <i className="fab fa-linkedin fa-lg" />
          </Button>

          <Button
            as={TelegramShareButton}
            url={url}
            title="Tessy Fabric Stores"
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#37aee2",
              color: "#fff",
            }}
          >
            <i className="fab fa-telegram fa-lg" />
          </Button>

          <Button
            as={TwitterShareButton}
            url={url}
            title="Tessy Fabric Stores"
            hashtags={["TessyFabricStores", "Ankara", "Quality", "LookGood"]}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#00aced",
              color: "#fff",
            }}
          >
            <i className="fab fa-twitter fa-lg" />
          </Button>

          <Button
            as={WhatsappShareButton}
            url={url}
            title="Tessy Fabric Stores"
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#25D366",
              color: "#fff",
            }}
          >
            <i className="fab fa-whatsapp fa-lg" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ShareButton;
