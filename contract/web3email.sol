// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Web3Gmail {
    struct Mail {
        address to;
        address from;
        string subject;
        string content;
    }

    mapping(address => Mail[]) public recievedMails; // Output -> Mails recieved by input address
    mapping(address => Mail[]) public sendMails; // Output -> Mails send by input address

    Mail public newMail;

    event NewMail(address from, address to, string content);

    function sendMail(
        address to,
        string memory subject,
        string memory content
    ) public returns (Mail memory) {
        require(to != msg.sender, "Can't send mail to Sender address");
        require(to != address(0), "Can't send mail to null address");
        require(bytes(content).length > 0, "Can't send mail to null address");
        newMail.from = msg.sender;
        newMail.to = to;
        newMail.subject = subject;
        newMail.content = content;
        recievedMails[to].push(newMail);
        sendMails[msg.sender].push(newMail);
        emit NewMail(msg.sender, to, content);
        return newMail;
    }

    function getRecievedMail(address user) public view returns (Mail[] memory) {
        return recievedMails[user];
    }

    function getSendMail(address user) public view returns (Mail[] memory) {
        return sendMails[user];
    }
}
