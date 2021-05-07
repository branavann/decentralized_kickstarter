pragma solidity^0.4.17;

contract Campaign {

    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) public approvals;
    }

    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers;
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
        approvers[msg.sender] = true;
    }

    function createRequest(string description, uint value, address recipient) public onlyManager {
        // Local variable hence we'll use the memory keyword 
        Request memory newRequest = Request({
            description: description,
            value: value,
            recipient: recipient,
            complete: bool,
            approvalCount: 0
        });
        requests.push(newRequest);
    }

    function approveRequest(uint index) public {

        // Storage variable because we want to update the struct and store any changes 
        const storage request = requests[index];

        // Ensures the user has contributed to the campaign
        require(approvers[msg.sender]);
        // Ensures the user hasn't voted on this particular request already
        require(!request.approvals[msg.sender]);

        // Updating our request struct with the user's information 
        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }
}