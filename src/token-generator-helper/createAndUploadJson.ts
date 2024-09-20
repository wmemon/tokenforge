import { PinataSDK } from 'pinata';

const gateway = "chocolate-main-walrus-517.mypinata.cloud"
const pinata = new PinataSDK({
  pinataJwt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI5Mjc4NDJjYy1mYzVkLTQ2NDQtOTA3OC01NTExOTYwN2I1M2YiLCJlbWFpbCI6IndtZW1vbjEwMEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiMDA3MmM3ZmRjYThhZDgxNGM0NWMiLCJzY29wZWRLZXlTZWNyZXQiOiI3YThkYTBhMzQ2MmZlMWQ1MTBkMTk5ZTI1NWFmZTgyYTZhYzM0YjE1OGRkZWYwMmFlZjU2MjhiNWU0NzRjMTZkIiwiaWF0IjoxNzI1NTE0MzU2fQ.8CTEP_fThZyQ-fNmxxhQTQMhux22DCeAWKF9LeAC4FQ",
  pinataGateway: gateway,
});


export default async function createAndUploadJson({tokenName, tokenDescription, tokenImageURL, tokenSymbol, creatorName, creatorWebsite} : {tokenName: string, tokenDescription: string, tokenImageURL: string, tokenSymbol: string, creatorName: string, creatorWebsite: string}){
    if(tokenName !== "" && tokenDescription !== "" && tokenImageURL !== null && tokenSymbol !== "" && creatorName !== "" && creatorWebsite !== ""){
        const jsonData = { "name": tokenName, "symbol": tokenSymbol, "description": tokenDescription, "image": tokenImageURL, "creator": { "name": creatorName, "site": creatorWebsite }}
        const jsonDataString = JSON.stringify(jsonData);
        const newJsonFile = new File([jsonDataString], "data.json", { type: "application/json" });
        const upload = await pinata.upload.file(newJsonFile);
        const signedURL = await pinata.gateways.createSignedURL({
          cid: upload.cid,
          expires: 5000000,
        });
        return signedURL;
        }
}