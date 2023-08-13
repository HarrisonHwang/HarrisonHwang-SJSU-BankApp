import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Accordion from "react-bootstrap/Accordion";

import { uploadFile } from "react-s3";
import AWS from "aws-sdk";

import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

import Button from "react-bootstrap/Button";

AWS.config.update({
  accessKeyId: "AKIA3FPU3UHCJEBJ7U5S",
  secretAccessKey: "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",
  region: "us-west-1",
  signatureVersion: "v4",
});

export default function SavingAccord({ acc_num, rout_num, balance, token }) {


  useEffect(() => {
    transactionHistory();
  }, []);



  //handle Transfer requests
  const [savingTransferAccNum, setSavingTransferAccNum] = useState();
  const [savingTransferRoutNum, setSavingTransferRoutNum] = useState();
  const [savingTransferAmount, setSavingTransferAmount] = useState();

  const handleSavingTransferSubmit = async (e) => {
    console.log("Saving transfer request");
    console.log(`Saving transfer account number: ${savingTransferAccNum}`);
    console.log(`Saving transfer routing number: ${savingTransferRoutNum}`);
    console.log(`Saving transfer amount: ${savingTransferAmount}`);

    //connect to backend here
    let balance = parseFloat(savingTransferAmount);
    if (balance < 0) {
      return;
    }

    // actual trasfer API causes issues where an extra refresh
    // is needed to actually display changes to host account

    let accountNumber = savingTransferAccNum;
    fetch(
      process.env.REACT_APP_BACKEND_URL +
        `/api/clients/me/accounts/${acc_num}/transfer`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // assuming you have a token for authentication
        },
        body: JSON.stringify({ accountNumber, balance }),
      }
    )
      .then((response) => {
        if (!response.ok) {
          console.log(response);
          throw new Error(response.statusText);
        }
        console.log("saving transfer");
        return response.json();
      })
      .then((data) => {
        console.log(data);
      });


      /*
      let description = `transfer $${balance} from account ${acc_num} to account ${savingTransferAccNum}`

      // withdraw from sending account
      fetch(
        process.env.REACT_APP_BACKEND_URL +
          `/api/clients/me/accounts/${acc_num}/withdraw`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // assuming you have a token for authentication
          },
          body: JSON.stringify({ balance, description }),
        })
        .then((response) => {
          if (!response.ok) {
            console.log(response);
            throw new Error(response.statusText);
          }
          console.log("saving transfer withdraw");
          return response.json();
        })
        .then((data) => {
          console.log(data);
        });

        //deposit to recieving account
        fetch(
          process.env.REACT_APP_BACKEND_URL +
            `/api/clients/me/accounts/${savingTransferAccNum}/deposit`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // assuming you have a token for authentication
            },
            body: JSON.stringify({ balance, description }),
          }
        )
        .then((response) => {
          if (!response.ok) {
            console.log(response);
            throw new Error(response.statusText);
          }
          console.log("saving transfer deposit");
          return response.json();
        })
        .then((data) => {
          console.log(data);
        });
        */
    //e.preventDefault();
  };

  //handle Withdraw requests
  const [savingWithdrawAmount, setSavingWithdrawAmount] = useState();

  const handleSavingWithdrawSubmit = async (e) => {
    console.log("Saving withdraw request");
    console.log(`Saving withdraw amount ${savingWithdrawAmount}`);

    //connect to backend here
    let balance = parseFloat(savingWithdrawAmount);
    if (balance < 0) {
      return;
    }
    let description = `withdraw of ${balance} from account ${acc_num}`;
    console.log(`withdraw ${balance}`);
    console.log(description);

    fetch(
      process.env.REACT_APP_BACKEND_URL +
        `/api/clients/me/accounts/${acc_num}/withdraw`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // assuming you have a token for authentication
        },
        body: JSON.stringify({ balance, description }),
      }
    )
      .then((response) => {
        if (!response.ok) {
          console.log(response);
          throw new Error(response.statusText);
        }
        console.log("saving withdraw");
        return response.json();
      })
      .then((data) => {
        console.log(data);
      });
    //e.preventDefault();
  };

  //handle Deposit requests
  const [savingDepositAmount, setSavingDepositAmount] = useState();

  const handleSavingDepositSubmit = async (e) => {
    console.log("Saving deposit request");
    console.log(`saving desposit amount: ${savingDepositAmount}`);

    let balance = parseFloat(savingDepositAmount);
    if (balance < 0) {
      return;
    }
    //console.log(typeof balance);
    let description = `deposit of $ ${balance} to account ${acc_num}`;
    console.log(`deposit ${balance}`);
    console.log(description);

    fetch(
      process.env.REACT_APP_BACKEND_URL +
        `/api/clients/me/accounts/${acc_num}/deposit`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // assuming you have a token for authentication
        },
        body: JSON.stringify({ balance, description }),
      }
    )
      .then((response) => {
        if (!response.ok) {
          console.log(response);
          throw new Error(response.statusText);
        }
        console.log("saving deposit");
        return response.json();
      })
      .then((data) => {
        console.log(data);
      });
    //e.preventDefault();
  };

  const s3 = new AWS.S3();
  const [imageUrl, setImageUrl] = useState(null);
  const [file, setFile] = useState(null);

  const handleFileSelect = (e) => {
    //setFile(e.target.files[0]);

    const file = e.target.files[0];

    const reader = new FileReader();
    reader.onload = (e) => {
      setImageUrl(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  /*
  //close account
  const closeAccount = async (e) => {
    fetch(
      process.env.REACT_APP_BACKEND_URL +
        `/api/clients/me/accounts/${acc_num}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // assuming you have a token for authentication
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          console.log(response);
          throw new Error(response.statusText);
        }
        console.log("close saving account");
        return response.json();
      })
      .then((data) => {
        console.log(data);
      });
      //window.location.reload();
  }
  */

  const [historyList, setHistoryList] = useState([]);
  //transaction history
  const transactionHistory = async () => {
    fetch(
      process.env.REACT_APP_BACKEND_URL +
        `/api/clients/me/transactions/${acc_num}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // assuming you have a token for authentication
        },
      }
    )
    .then((response) => {
      if (!response.ok) {
        console.log(response);
        throw new Error(response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      //console.log(data);
      //console.log(`transAmt: ${data.transactions[0].transactionAmt}`);
      //console.log(`transType: ${data.transactions[0].transactionType}`);
      //console.log(`transDesc: ${data.transactions[0].description}`);
      const tempHistoryList = [];
      if(data.transactions.length > 0){
        for(let i = 0; i< data.transactions.length; i++){
          if(data.transactions[i].transactionType === "Transfer"){
            tempHistoryList.push('$' + data.transactions[i].transactionAmt + ' ' + data.transactions[i].description + '\n');
          } else {
            tempHistoryList.push(data.transactions[i].description + '\n');
          }
        }
      } else {
        console.log("no transaction history");
        return;
      }


      setHistoryList(tempHistoryList);
    });
  }

  return (
    <Accordion>
      <Accordion.Item eventKey="0">
        <Accordion.Header>
          {acc_num} --- Balance: ${balance.toFixed(2)}
        </Accordion.Header>
        <Accordion.Body>
          <Accordion>
            <h1>Balance: ${balance.toFixed(2)}</h1>
            <Accordion.Item eventKey="1T">
              <Accordion.Header>Transfer</Accordion.Header>
              <Accordion.Body>
                <form
                  onSubmit={(e) => {
                    handleSavingTransferSubmit(e);
                  }}
                >
                  <label>Account Number</label>
                  <input
                    name="saving_transfer_account_number"
                    placeholder="Account Number"
                    type="number"
                    value={savingTransferAccNum}
                    onChange={(e) => setSavingTransferAccNum(e.target.value)}
                    required
                  />
                  <br />
                  <br />
                  <label>Routing Number</label>
                  <input
                    name="saving_transfer_routing_number"
                    placeholder="Routing Number"
                    type="number"
                    value={savingTransferRoutNum}
                    onChange={(e) => setSavingTransferRoutNum(e.target.value)}
                    required
                  />
                  <br />
                  <br />
                  <label>Amount</label>
                  <input
                    name="saving_transfer_amount"
                    placeholder="$Amount"
                    type="number"
                    step="0.01"
                    value={savingTransferAmount}
                    onChange={(e) => setSavingTransferAmount(e.target.value)}
                    required
                  />
                  <br />
                  <br />
                  <button type="submit">Transfer</button>
                </form>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="1W">
              <Accordion.Header>Withdraw</Accordion.Header>
              <Accordion.Body>
                <form
                  onSubmit={(e) => {
                    handleSavingWithdrawSubmit(e);
                  }}
                >
                  <label>Amount</label>
                  <input
                    name="saving_withdraw_amount"
                    placeholder="$Amount"
                    type="number"
                    step="0.01"
                    value={savingWithdrawAmount}
                    onChange={(e) => setSavingWithdrawAmount(e.target.value)}
                    required
                  />
                  <br />
                  <br />
                  <button type="submit">Withdraw</button>
                </form>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="1D">
              <Accordion.Header>Deposit</Accordion.Header>
              <Accordion.Body>
                <form
                  onSubmit={(e) => {
                    handleSavingDepositSubmit(e);
                  }}
                >
                  <label>Input Check Image (Front and Back)</label>
                  <input
                    name="saving_deposit_check_image"
                    type="file"
                    onChange={handleFileSelect}
                    required
                  />
                  <input
                    name="saving_deposit_check_image"
                    type="file"
                    onChange={handleFileSelect}
                    required
                  />
                  <h5>AND</h5>
                  <label>Input Deposit Amount:</label>
                  <input
                    name="saving_deposit_amount"
                    placeholder="$Amount"
                    type="number"
                    step="0.01"
                    value={savingDepositAmount}
                    onChange={(e) => setSavingDepositAmount(e.target.value)}
                    required
                  />
                  <br />
                  <br />
                  {/* this line for AWS Bucket
                    <button onClick={uploadToS3} type="submit">Deposit</button>*/}
                  <button type="submit">Deposit</button>
                </form>

                <h3>Check Image:</h3>
                {imageUrl && <img src={imageUrl} alt="Check Image Not Found" />}
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="1I">
              <Accordion.Header>Information</Accordion.Header>
              <Accordion.Body>
                <h3>Account Number: {acc_num}</h3>
                <h3>Routing Number: {rout_num}</h3>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="1H">
              <Accordion.Header>Transaction History</Accordion.Header>
              <Accordion.Body>
                {historyList.map((item, index) => (
                  <div key={index}>{item}</div>))}
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}
