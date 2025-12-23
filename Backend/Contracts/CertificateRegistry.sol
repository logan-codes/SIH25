// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CertificateRegistry {
    struct Certificate {
        string recipient;
        string issuer;
        string issued_on;
        bool valid;
    }

    mapping(string => Certificate) public certificates; 
    address public owner;

    event CertificateIssued(string file ,string recipient, string issuer, string issued_on);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not contract owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function issueCertificate(
        string memory recipient,
        string memory issuer,
        string memory issued_on,
        string memory file
    ) public onlyOwner {
        require(!certificates[file].valid, "Certificate already exists");
        certificates[file] = Certificate(recipient, issuer, issued_on, true);
        emit CertificateIssued(file, recipient, issuer, issued_on);
    }

    function certificateExists(string memory file) public view returns (bool) {
        return bytes(certificates[file].recipient).length > 0;
    }

    function verifyCertificate(string memory file) public view returns (string memory recipient, string memory issuer, string memory issued_on, bool valid) {
        require(certificateExists(file), "Certificate not found");
        Certificate memory cert = certificates[file];
        return (cert.recipient, cert.issuer, cert.issued_on, cert.valid);
    }

}   