// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CertificateRegistry {
    struct Certificate {
        string recipient;
        string issued_by;
        bool valid;
    }

    mapping(string => Certificate) public certificates; 
    address public owner;

    event CertificateIssued(string file ,string recipient, string issued_by);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not contract owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function issueCertificate(
        string memory recipient,
        string memory issued_by,
        string memory file
    ) public onlyOwner {
        require(!certificates[file].valid, "Certificate already exists");
        certificates[file] = Certificate(recipient, issued_by, true);
        emit CertificateIssued(file, recipient, issued_by);
    }

    function certificateExists(string memory file) public view returns (bool) {
        return bytes(certificates[file].recipient).length > 0;
    }

    function verifyCertificate(string memory file) public view returns (string memory recipient, string memory issued_by, bool valid) {
        require(certificateExists(file), "Certificate not found");
        Certificate memory cert = certificates[file];
        return (cert.recipient, cert.issued_by, cert.valid);
    }

}   