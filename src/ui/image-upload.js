require("static/css/image-upload.css");
import React from 'react';
import FireBaseCon from 'ui/firebase-con';
const STATE = {
  PRE : 0,
  SUCCESS : 1,
  PENDING : 2,
  COMPLETE : 3,
  VERIFY : 4,
}
class ImageUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        file: '',imagePreviewUrl: '',
        cstate : STATE.PRE,
    };
  }

  _handleSubmit(e) {
    e.preventDefault();
    // TODO: do something with -> this.state.file
    console.log('handle uploading-', this.state.file);
    if(this.state.file){
      this.setState({
        cstate : STATE.PENDING,
      })
      this.props.createToast(`Uploading...`, true);
      FireBaseCon.uploadFile(this.state.file)
        .then(()=>{
          this.props.clearToast();
          this.setState({
            cstate: STATE.COMPLETE
          })
        }).catch((err)=>{
          console.error(err);
          this.props.clearToast();
          // ZToast.makeToast(`Upload fail just retry!`);
          this.props.createToast(`Upload fail just retry!`);
          this.setState({
            cstate : STATE.VERIFY
          })
        })
    }else{
      this.setState({
        cstate : STATE.PRE
      })
    }
  }
  _handleCancel(e){
    this.setState({
      imagePreviewUrl : null,
      file : null
    })
  }

  _handleImageChange(e) {
    console.error('go to _handleImageChange');
    e.preventDefault();
    e.stopPropagation();

    let reader = new FileReader();
    let file = e.target.files[0];
    this.setState({
      file : null,
      imagePreviewUrl : 'loading'
    })

    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result
      });
    }

    reader.readAsDataURL(file)
  }
  _handleDone(){
    this.setState({
      file : null,
      imagePreviewUrl : null, 
      cstate : STATE.PRE
    })
  }

  render() {
    let {imagePreviewUrl} = this.state;
    let $imagePreview = null;
    if (imagePreviewUrl && imagePreviewUrl !== 'loading') {
      $imagePreview = (<img src={imagePreviewUrl} style={{width: '90vw'}} />);
    } else {
      $imagePreview = null;
      //(<div className="previewText">Please select an Image for Preview</div>);
    }
    if(this.state.cstate === STATE.COMPLETE){
      return(<div className="content-container">
          <div className="previewComponent" style={{background: 'rgba(108, 117, 125, 0.4)',borderRadius: '18px'}}>
            <div className="imgPreview">
              <img src="https://b-f21-zpg.zdn.vn/8143017840750109785/4496e225764c9212cb5d.jpg" style={{maxHeight: '300px'}}/>
            </div>
          </div>
          {true?(<div style={{display:'flex', margin : '0 auto', marginBottom:'10vh'}}>
              <div className="btn-submit-style shiny-btn" style={{ background: '#00b6f0'}}
                type="submit" 
                onClick={(e)=>this._handleDone(e)}>DONE</div>
            </div>) : null}        
        </div>
      )
    }
    return (
      <div className="content-container">
        <div className="previewComponent" style ={!!imagePreviewUrl? {background: 'rgba(108, 117, 125, 0.4)',borderRadius: '18px'}: {}}>
          {!imagePreviewUrl ? 
          (<div className="formContainer">
            <div className="inputfile-container text-center" style={{display: 'flex',flex: 1,flexDirection: 'column-reverse'}}>
              <input type="file" name="file2" onChange={this._handleImageChange.bind(this)}
                style={{display : 'none', overflow : 'hidden'}}
                id="file2" className="inputfile" multiple=""/>
              <label className="shiny-btn" onChange={this._handleImageChange.bind(this)}
                htmlFor="file2" style={{height: '25x'}}>
                  {"Upload Image"}
                </label>
            </div>                    
          </div>) : null}
          <div className="imgPreview">
            {$imagePreview}
          </div>
        </div>
        {imagePreviewUrl?(<div style={{display:'flex', margin : '0 auto', marginBottom:'10vh'}}>
            <div className="btn-submit-style shiny-btn" style={{ background: '#00b6f0'}}
              type="submit" 
              onClick={(e)=>this._handleSubmit(e)}>Verify</div>
            <div className="btn-submit-style shiny-btn" style={{ background: '#fc4a4a'}}
              type="submit" 
              onClick={(e)=>this._handleCancel(e)}>Cancel</div>

          </div>) : null}        
      </div>
      
    )
  }
}
export default ImageUpload;