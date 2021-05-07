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
    mapping(address => bool) public contributors;
    Request[] public requests;
    uint public contributorsCount;

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
        contributors[msg.sender] = true;
        contributorsCount++;
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

        // Add our new request in our array of all requests 
        requests.push(newRequest);
    }

    function approveRequest(uint index) public {

        // Storage variable because we want to update the struct and store any changes 
        const storage request = requests[index];

        // Ensures the user has contributed to the campaign
        require(contributors[msg.sender]);
        // Ensures the user hasn't voted on this particular request already
        require(!request.approvals[msg.sender]);

        // Updating our request struct with the user's information 
        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint index) public onlyManager {

        const storage request = requests[index];

        // Ensures our request hasn't been finalized in the past 
        require(!request.complete);
        // Ensures consensus; minimum of half the contributors or approvers must approve this speicific request
        require(request.approvalCount > (contributorsCount/2));

        // Transfering the money 
        request.recipient.transfer(request.value);
        // Updating our request struct
        request.complete = true;

    }
}