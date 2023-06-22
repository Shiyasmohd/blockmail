// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Web3Gmail {
    struct Mail {
        uint256 mailId;
        address to;
        address from;
        string subject;
        string content;
        uint256 timestamp;
        bool isDeleted;
        bool isStarred;
    }

    mapping(address => Mail[]) private recievedMails; // Output -> Mails recieved by input address
    mapping(address => Mail[]) private sendMails; // Output -> Mails send by input address

    event NewMail(uint256 mailId, address from, address to, string content);
    event MailDeleted(uint256 mailId);

    uint256 public mailCount;

    constructor(){
        mailCount = 0;
    }

    function sendMail(
        address to,
        string memory subject,
        string memory content
    ) public returns (Mail memory) {
        require(to != msg.sender, "Can't send mail to Sender address");
        require(to != address(0), "Can't send mail to null address");
        require(bytes(content).length > 0, "Can't send mail to null address");

        Mail memory newMail = Mail({
            mailId: mailCount,
            to: to,
            from: msg.sender,
            subject: subject,
            content: content,
            timestamp: block.timestamp,
            isDeleted: false,
            isStarred: false
        });

        recievedMails[to].push(newMail);
        sendMails[msg.sender].push(newMail);

        emit NewMail(mailCount, msg.sender, to, content);

        mailCount++;
        return newMail;
    }

    function deleteMail(uint256 mailId) public {
        Mail memory mail = recievedMails[msg.sender][mailId];
        require(mail.from == msg.sender, "Can't delete mail of other user");
        recievedMails[msg.sender][mailId].isDeleted = true;
        emit MailDeleted(mailId);
    }

    function starMail(uint256 mailId) public {
        Mail memory mail = recievedMails[msg.sender][mailId];
        require(mail.from == msg.sender, "Can't star mail of other user");
        recievedMails[msg.sender][mailId].isStarred = true;
    }

    function getRecievedMail(address user) public view returns (Mail[] memory) {
        require(user == msg.sender, "Can't get recieved mail of other user");
        // avoid deleted mails
        Mail[] memory mails = recievedMails[user];
        uint256 count = 0;
        for (uint256 i = 0; i < mails.length; i++) {
            if (!mails[i].isDeleted) {
                count++;
            }
        }

        Mail[] memory filteredMails = new Mail[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < mails.length; i++) {
            if (!mails[i].isDeleted) {
                filteredMails[index] = mails[i];
                index++;
            }
        }
        return filteredMails;
    }

    function getSendMail(address user) public view returns (Mail[] memory) {
        require(user == msg.sender, "Can't get send mail of other user");
        return sendMails[user];
    }

}
