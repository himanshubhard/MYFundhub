import styled from 'styled-components';
import { FormState } from '../Form';
import { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import { TailSpin } from 'react-loader-spinner';
import axios from 'axios';

// Get Pinata API credentials from environment variables
const apiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY;
const secretApiKey = process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY;

const FormRightWrapper = () => {
  const Handler = useContext(FormState);

  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const uploadToPinata = async (file) => {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

    let data = new FormData();
    data.append('file', file);

    const metadata = JSON.stringify({
      name: file.name,
      keyvalues: {
        exampleKey: 'exampleValue'
      }
    });

    data.append('pinataMetadata', metadata);

    const pinataOptions = JSON.stringify({
      cidVersion: 0
    });

    data.append('pinataOptions', pinataOptions);

    try {
      const response = await axios.post(url, data, {
        maxContentLength: 'Infinity',
        headers: {
          'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
          pinata_api_key: apiKey,
          pinata_secret_api_key: secretApiKey
        }
      });
      return response.data.IpfsHash;
    } catch (error) {
      console.error(error);
      throw new Error('Error uploading file to Pinata');
    }
  };

  const uploadFiles = async (e) => {
    e.preventDefault();
    setUploadLoading(true);

    if (Handler.form.story !== "") {
      try {
        const addedPath = await uploadToPinata(new Blob([Handler.form.story], { type: 'text/plain' }));
        Handler.setStoryUrl(addedPath);
      } catch (error) {
        toast.warn('Error Uploading Story');
      }
    }

    if (Handler.image !== null) {
      try {
        const addedPath = await uploadToPinata(Handler.image);
        Handler.setImageUrl(addedPath);
      } catch (error) {
        toast.warn('Error Uploading Image');
      }
    }
    

    setUploadLoading(false);
    setUploaded(true);
    Handler.setUploaded(true);
    toast.success('Files Uploaded Successfully');
  };

  return (
    <FormRight>
      <FormInput>
        <FormRow>
          <RowFirstInput>
            <label>Required Amount</label>
            <Input onChange={Handler.FormHandler} value={Handler.form.requiredAmount} name="requiredAmount" type={'number'} placeholder='Required Amount'></Input>
          </RowFirstInput>
          <RowSecondInput>
            <label>Choose Category</label>
            <Select onChange={Handler.FormHandler} value={Handler.form.category} name="category">
              <option>Education</option>
              <option>Health</option>
              <option>Animal</option>
            </Select>
          </RowSecondInput>
        </FormRow>
      </FormInput>
      {/* Image */}
      <FormInput>
        <label>Select Image</label>
        <Image alt="dapp" onChange={Handler.ImageHandler} type={'file'} accept='image/*'>
        </Image>
      </FormInput>
      {uploadLoading == true ? <Button><TailSpin color='#fff' height={20} /></Button> :
        uploaded == false ? 
        <Button onClick={uploadFiles}>
          Upload Files to Pinata
        </Button>
        : <Button style={{cursor: "no-drop"}}>Files uploaded Successfully</Button>
      }
      <Button onClick={Handler.startCampaign}>
        Start Campaign
      </Button>
    </FormRight>
  );
};

const FormRight = styled.div`
  width:45%;
`;

const FormInput = styled.div`
  display:flex;
  flex-direction:column;
  font-family:'poppins';
  margin-top:10px;
`;

const FormRow = styled.div`
  display: flex;
  justify-content:space-between;
  width:100%;
`;

const Input = styled.input`
  padding:15px;
  background-color:${(props) => props.theme.bgDiv};
  color:${(props) => props.theme.color};
  margin-top:4px;
  border:none;
  border-radius:8px;
  outline:none;
  font-size:large;
  width:100%;
`;

const RowFirstInput = styled.div`
  display:flex;
  flex-direction:column;
  width:45%;
`;

const RowSecondInput = styled.div`
  display:flex;
  flex-direction:column;
  width:45%;
`;

const Select = styled.select`
  padding:15px;
  background-color:${(props) => props.theme.bgDiv};
  color:${(props) => props.theme.color};
  margin-top:4px;
  border:none;
  border-radius:8px;
  outline:none;
  font-size:large;
  width:100%;
`;

const Image = styled.input`
  background-color:${(props) => props.theme.bgDiv};
  color:${(props) => props.theme.color};
  margin-top:4px;
  border:none;
  border-radius:8px;
  outline:none;
  font-size:large;
  width:100%;

  &::-webkit-file-upload-button {
    padding: 15px;
    background-color: ${(props) => props.theme.bgSubDiv};
    color: ${(props) => props.theme.color};
    outline:none;
    border:none;
    font-weight:bold;
  }
`;

const Button = styled.button`
  display: flex;
  justify-content:center;
  width:100%;
  padding:15px;
  color:white;
  background-color:#00b712;
  background-image: linear-gradient(180deg, #00b712 0%, #5aff15 80%);
  border:none;
  margin-top:30px;
  cursor: pointer;
  font-weight:bold;
  font-size:large;
`;

export default FormRightWrapper;
