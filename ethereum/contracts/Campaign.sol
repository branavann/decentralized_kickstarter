pragma solidity^0.6.5;

contract CampaignFactory {

    address[] public deployedCampaigns;

    // Deploys a campaign and returns the address to our array
    function createCampaign(uint minimum) public {
        address newCampaign = address(new Campaign(minimum, msg.sender));
        deployedCampaigns.push(newCampaign);
    }

    // Returns the entire array of deployed campaigns 
    function getDeployedCampaigns() public view returns(address[] memory) {
        return deployedCampaigns;
    }

}

contract Campaign {

    struct Request {
        string description;
        uint value;
        address payable recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }

    address payable public manager;
    uint public minimumContribution;
    mapping(address => bool) public contributors;
    Request[] public requests;
    uint public contributorsCount;

    modifier onlyManager() {
        require(msg.sender == manager);
        _;
    }

    constructor(uint minimum, address payable creator) public {
        manager = creator;
        minimumContribution = minimum;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution);
        contributors[msg.sender] = true;
        // Keeping track of the contributors 
        contributorsCount++;
    }

    function createRequest(string memory description, uint value, address payable recipient) public onlyManager {
        
        // Local variable hence we'll use the memory keyword 
        Request memory newRequest = Request({
            description: description,
            value: value,
            recipient: recipient,
            complete: false,
            approvalCount: 0
        });

        // Add our new request in our array of all requests 
        requests.push(newRequest);
    }

    function approveRequest(uint index) public {

        // Storage variable because we want to update the struct and store any changes 
        Request storage request = requests[index];

        // Ensures the user has contributed to the campaign
        require(contributors[msg.sender]);
        // Ensures the user hasn't voted on this particular request already
        require(!request.approvals[msg.sender]);

        // Updating our request struct with the user's information 
        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint index) public onlyManager {

        Request storage request = requests[index];

        // Ensures our request hasn't been finalized in the past 
        require(!request.complete);
        // Ensures consensus; minimum of half the contributors or approvers must approve this speicific request
        require(request.approvalCount > (contributorsCount/2));

        // Transfering the money 
        request.recipient.transfer(request.value);
        // Updating our request struct
        request.complete = true;

    }

    function getSummary() public view returns (uint, uint, uint, uint, address) {
        return (
            minimumContribution,
            address(this).balance,
            requests.length,
            contributorsCount,
            manager
        );
    }

    function getRequestsCount() public view returns (uint) {
        return requests.length;
    }
}