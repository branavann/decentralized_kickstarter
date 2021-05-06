pragma solidity^0.4.17;

contract Campaign {

    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
    }

    address public manager;
    uint public minimumContribution;
    address[] public approvers;
    Request[] public requests;

    modifier onlyManager() {
        require(msg.sender == manager);
        _;
    }

    function Campaign(uint minimum) public {
        manager = msg.sender;
        minimumContribution = minimum;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution);
        approvers.push(msg.sender);
    }

    function createRequest(string description, uint value, address recipient) public onlyManager {
        Request newRequest = Request({
            description: description,
            value: value,
            recipient: recipient,
            complete: bool
        });
        requests.push(newRequest);
    }
}