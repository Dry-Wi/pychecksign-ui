import { Button, Form } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import axios from "axios";

export const Main = () => {
  const [isWalletInstalled, setIsWalletInstalled] = useState<boolean>(false);
  const [account, setAccount] = useState<string | null>(null);
  useEffect(() => {
    if ((window as any).ethereum) {
      setIsWalletInstalled(true);
    }
  }, []);

  async function sign(params: any) {
    const provider = new ethers.providers.Web3Provider(
      (window as any).ethereum
    );

    const signer = provider.getSigner();
    const signature = await signer.signMessage(params.message);
    await axios.post(
      "http://127.0.0.1:8000/verify",
      {
        nonce: params.message,
        signature: signature,
        address: signer.getAddress(),
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
  }

  async function connectWallet(): Promise<void> {
    try {
      const accounts = (await (window as any).ethereum.request({
        method: "eth_requestAccounts",
      })) as string[];

      if (accounts.length > 0) {
        setAccount(accounts[0]);
      } else {
        alert("User has no wallet configured");
      }
    } catch (e) {
      alert(`Something went wrong: ${e}`);
    }
  }
  return (
    <>
      <Container>
        <Navbar>
          <Container>
            <Navbar.Brand href="#home">Sign Messages</Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
              {account ? (
                <div>{account}</div>
              ) : (
                <Button className="primary" onClick={connectWallet}>
                  Connect
                </Button>
              )}
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </Container>
      <Container>
        <Form>
          <Form.Group>
            <Form.Label>Text to sign</Form.Label>
            <Form.Control
              as="textarea"
              defaultValue="Message to sign"
              id="message"
              rows={3}
            ></Form.Control>
          </Form.Group>
          <Form.Group>
            <Button variant="primary" onClick={sign} disabled={account == null}>
              Sign
            </Button>
          </Form.Group>
        </Form>
      </Container>
    </>
  );
};